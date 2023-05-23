import React, { useState, useEffect, useRef, createRef } from 'react'
import { axiosClient } from '../axiosClient'
import { Dropdown } from 'primereact/dropdown'
import { MultiStateCheckbox } from 'primereact/multistatecheckbox'
import { Button } from 'primereact/button'
import { bibles } from '../bibles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'
import { OverlayPanel } from 'primereact/overlaypanel'
import { useQueryClient } from 'react-query'
import { Accordion, AccordionTab } from 'primereact/accordion';

const TileSelector = props => {
  const [bible, setBible] = useState({})
  const [book, setBook] = useState({})
  const [verses, setVerses] = useState([])
  const [verse, setVerse] = useState(null)
  const [versesEnd, setVersesEnd] = useState([])
  const [verseEnd, setVerseEnd] = useState(null)
  const [passage, setPassage] = useState({})
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [extended, setExtended] = useState('')
  const [activeIndex, setActiveIndex] = useState(null);
  const options = [{ value: true, icon: 'pi pi-minus' }]
  const toast = useRef(null)
  const op = useRef(null);
  const queryClient = useQueryClient()

  const verseSelections = chapters => {
    const verseSelections = []
    chapters.map((chapter, index) => {
      const chapterVerses = Array.from(
        { length: Number(chapter) },
        (_, i) => i + 1 + ''
      )
      chapterVerses.map(chapterVerse => {
        verseSelections.push(index + 1 + ':' + chapterVerse)
      })
    })
    return verseSelections
  }

  const verseSelectionsEnd = (start, chapter) => {
    const verseSelections = []
    const chapterVerses = Array.from(
      { length: Number(chapter) },
      (_, i) => i + 1 + ''
    )
    chapterVerses.map(chapterVerse => {
      if (Number(chapterVerse) > Number(start)) {
        verseSelections.push(chapterVerse)
      }
    })
    return verseSelections
  }

  useEffect(() => {
    // If a version or passageId is passed in, render that
    const version = props.version || bible.abbreviation
    let findBible
    if (version) {
      // Set the bible version according to the props that were passed in.
      findBible = bibles.find(b => b.abbreviation === version)
      setBible(findBible)
    }

    const passageId = props.passageId || passage.passageId
    if (passageId && findBible && findBible.books) {
      // Parse the passageId, e.g. 'GEN.1.1-2'
      const refs = passageId.split('-')
      const start = refs[0].split('.')
      const findBook = findBible.books.find(b => b.id === start[0])
      setBook(findBook)
      const selections = verseSelections(findBook.chapters)
      setVerses(selections)

      const _rangeStart = start[2] || 1
      const _rangeEnd = findBook.chapters[Number(start[1]) - 1]
      const selectionsEnd = verseSelectionsEnd(_rangeStart, _rangeEnd)
      setVersesEnd(selectionsEnd)

      if (start[2]) {
        setVerse(start[1] + ':' + start[2])
      } else {
        // This is a reference to the entire chapter
        setVerse(start[1] + ':1')
        setExtended(true)
        setVerseEnd(_rangeEnd - 1)
      }

      if (refs[1]) {
        setExtended(true)
        setVerseEnd(refs[1])
      }
    }
  }, [props.version, props.passageId])

  useEffect(() => {
    if (props.readOnly) {
      const { reference, html } = props
      setPassage({ reference, html })
    }
    else {
      // Retrieve the passage afresh if parameters change
      if (verse) {
        const _passageId = `${book.id}.${verse.replace(':', '.')}${extended && verseEnd ? `-${verseEnd}` : ''
          }`
        fetchPassage(props.version, _passageId)
      }
    }
  }, [props.version, verse, extended, verseEnd])

  const onChangeTile = _book => {
    if (_book) {
      setBook(_book)
      const selections = verseSelections(_book.chapters)
      setVerses(selections)
      setVersesEnd([])
    } else {
      setBook({})
      setVerses([])
      setVersesEnd([])
    }
    setVerse(null)
    setVerseEnd(null)
    setPassage({})
  }

  const onChangeTileVerse = ci => {
    setVerse(`${ci + 1}:1`)
    const _rangeStart = Number(1)
    const _rangeEnd = book.chapters[Number(ci)]
    const selectionsEnd = verseSelectionsEnd(_rangeStart, _rangeEnd)
    setVersesEnd(selectionsEnd)
    setExtended(true)
    setVerseEnd(_rangeEnd)
    op?.current?.hide()
    setActiveIndex(null)
  }

  const onChangeVerse = e => {
    setVerse(e.value)
    const start = e.value.split(':')
    const _rangeStart = Number(start[1])
    const _rangeEnd = book.chapters[Number(start[0]) - 1]
    const selectionsEnd = verseSelectionsEnd(_rangeStart, _rangeEnd)
    setVersesEnd(selectionsEnd)
    setVerseEnd(null)
  }

  const onChangeExtended = e => {
    if (!e.value) {
      setVerseEnd(null)
    } else {
      const start = verse.split(':')
      const selectionsEnd = verseSelectionsEnd(
        start[1],
        book.chapters[start[0]]
      )
      setVersesEnd(selectionsEnd)
    }
    setExtended(e.value)
  }

  const onChangeVerseEnd = e => {
    setVerseEnd(e.value)
    if (!verse) {
      setPassage({})
    }
  }

  const getPassage = async url => {
    const { data } = await axiosClient({
      method: 'get',
      url,
      headers: {
        accept: 'application/json'
      }
    })
    return data
  }

  const fetchPassage = async (version, passageId) => {
    setLoading(true)
    let ref =
      passageId ||
      `${book.id}.${verse.replace(':', '.')}${extended && verseEnd ? `-${verseEnd}` : ''
      }`

    const url = `/verses/${version || bible.abbreviation}/${ref}`

    const response = await queryClient.fetchQuery({
      queryKey: ['passage', url],
      queryFn: () => getPassage(url),
      options: {
        cacheTime: 600000
      }
    })

    const formatted = formatVerses(response)

    setPassage(formatted)
    if (props.setPassage) props.setPassage(formatted)
    setLoading(false)

    axiosClient.post('/metrics/verse_read', { ref, version })
  }

  const formatVerses = verses => {
    const _passage = {}

    if (Array.isArray(verses) && verses.length > 0) {
      let _bible = {}
      let _book = {}
      if (bible && bible.books) {
        _bible = bible
        _book = bible.books.find(b => b.id === verses[0].book)
      } else {
        _bible = bibles.find(b => b.abbreviation === props.version)
        _book = _bible.books.find(b => b.id === verses[0].book)
      }

      let endRef = ''
      if (verses.length > 1) {
        endRef = `-${verses[verses.length - 1].verse}`
      }

      _passage.version = _bible.abbreviation
      _passage.passageId = `${_book.id}.${verses[0].chapter}.${verses[0].verse}${endRef}`
      _passage.reference = `${_book.name} ${verses[0].chapter}:${verses[0].verse}${endRef}`
      _passage.html = verses
        .map(v => ` <sup>${v.verse}</sup> ${v.text}`)
        .join('')
        .trim()
    }

    return _passage
  }

  const verseRef = book
    ? `${book.id}.${verse ? verse.replace(':', '.') : ''}${extended && verseEnd ? `-${verseEnd}` : ''
    }`
    : ''

  const chapterNumber = Number(verse ? verse.split(':')[0] : 0)

  const openChapter = _chapterNumber => {
    const chapterRef = `${book.id}.${_chapterNumber}`
    const url = `${typeof window !== 'undefined'
      ? window.location.protocol + '//' + window.location.host.split(/\//)[0]
      : ''
      }?r=${chapterRef}&v=${bible.abbreviation}`
    window.open(url)
  }

  const readChapter = _chapterNumber => {
    const _rangeStart = 1
    const _rangeEnd = book.chapters[_chapterNumber - 1]
    const selectionsEnd = verseSelectionsEnd(_rangeStart, _rangeEnd)
    setVersesEnd(selectionsEnd)
    setVerse(`${_chapterNumber}:1`)
    setExtended(true)
    setVerseEnd(_rangeEnd - 1)
  }

  return (
    <>
      <Toast ref={toast} position='bottom-right'></Toast>
      {props.readOnly ? (
        ''
      ) : (
        <div>
          <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <AccordionTab header={<Button
              label={bible?.abbreviation=='NVI' ? 'Antiguo Testamento' : 'Old Testament'}
              className="p-button-text"
            />}>
              {bible?.books?.map((b, i) => {
                return i < 39 ?
                  <Button
                    key={b.id}
                    label={b.name}
                    className="p-button-text"
                    type="button"
                    onClick={(e) => { onChangeTile(b); op?.current?.show(e) }} aria-haspopup aria-controls="overlay_panel" />
                  : <></>
              })}
            </AccordionTab>
            <AccordionTab header={<Button
              label={bible?.abbreviation=='NVI' ? 'Nuevo Testamento' : 'New Testament'}
              className="p-button-text"
            />}>
              {bible?.books?.map((b, i) => {
                return i >= 39 ?
                  <Button
                    key={b.id}
                    label={b.name}
                    className="p-button-text"
                    type="button"
                    onClick={(e) => { onChangeTile(b); op?.current?.show(e) }} aria-haspopup aria-controls="overlay_panel" />
                  : <></>
              })}
            </AccordionTab>
          </Accordion>

          <OverlayPanel ref={op} showCloseIcon id="overlay_panel" className="overlay-panel">
            <div className='d-flex flex-wrap mt-4'>
              {book?.chapters?.map((c, ci) => {
                return (
                  <Button
                    key={ci}
                    className="p-button-text"
                    label={`${bible?.abbreviation=='NVI' ? 'Capítulo' : 'Chapter'} ${ci + 1}`}
                    onClick={() => onChangeTileVerse(ci)}
                  />
                )
              })}
            </div>
          </OverlayPanel>

          <div className='flex align-content-center m-3'>
            <Dropdown
              value={verse}
              options={verses || []}
              onChange={onChangeVerse}
              placeholder='Verse'
              editable
              style={{ width: 120 }}
              disabled={!book || !book.chapters}
            />
            <MultiStateCheckbox
              style={{ marginTop: 12, marginLeft: 6, marginRight: 6 }}
              value={extended}
              options={options}
              optionValue='value'
              onChange={onChangeExtended}
            />
            {extended ? (
              <>
                <Dropdown
                  value={verseEnd}
                  options={versesEnd || []}
                  onChange={onChangeVerseEnd}
                  placeholder='Verse'
                  editable
                  style={{ width: 120 }}
                  disabled={!book.chapters}
                />
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      )}

      <div className='flex align-content-center'>
        {book && verse ? (
          <>
            <h3>{`${passage.reference || ''} (${bible.abbreviation ||
              ''})`}</h3>
            {props.readOnly ? (
              ''
            ) : (
              <>
                &nbsp;
                {chapterNumber > 1 ? (
                  <Button
                    className='button-rounded button-text m-1'
                    icon='pi pi-arrow-circle-left'
                    onClick={() => readChapter(chapterNumber - 1)}
                    tooltip='Previous Chapter'
                    tooltipOptions={{ position: 'left' }}
                  />
                ) : (
                  ''
                )}
                <Button
                  className='button-rounded button-text m-1'
                  icon='pi pi-book'
                  onClick={() => readChapter(chapterNumber)}
                  tooltip='Read Chapter'
                  tooltipOptions={{ position: 'left' }}
                />
                {chapterNumber < book.chapters.length ? (
                  <Button
                    className='button-rounded button-text m-1'
                    icon='pi pi-arrow-circle-right'
                    onClick={() => readChapter(chapterNumber + 1)}
                    tooltip='Next Chapter'
                    tooltipOptions={{ position: 'left' }}
                  />
                ) : (
                  ''
                )}
              </>
            )}
            &nbsp;
            <Button
              link
              className='button-rounded button-text'
              icon='pi pi-window-maximize'
              onClick={() => openChapter(chapterNumber)}
              tooltip='Open Chapter'
              tooltipOptions={{ position: 'left' }}
            />
            &nbsp;
            <CopyToClipboard
              style={{ cursor: 'copy' }}
              text={`${typeof window !== 'undefined' ? window.location.origin : ''
                }?r=${verseRef}&v=${bible.abbreviation}`}
              onCopy={() => {
                axiosClient.post('/metrics/verse_copied', {
                  ref: verseRef,
                  version: bible.abbreviation
                })
                toast.current.show({
                  severity: 'success',
                  summary: 'Link Copied'
                })
              }}
            >
              <div className='flex align-items-center'>
                <i className='pi pi-upload' />
              </div>
            </CopyToClipboard>
          </>
        ) : (
          ''
        )}
      </div>
      {loading ? (
        <i
          className='pi pi-spin pi-spinner'
          style={{ margin: 10, fontSize: '4em' }}
        ></i>
      ) : props.refOnly ? (
        ''
      ) : (
        <div className='mt-0' dangerouslySetInnerHTML={{ __html: passage.html || '' }} />
      )}
    </>
  )
}

export default TileSelector

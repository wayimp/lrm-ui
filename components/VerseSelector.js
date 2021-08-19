import React, { useState, useEffect, useRef } from 'react'
import { axiosClient } from '../axiosClient'
import { Dropdown } from 'primereact/dropdown'
import { MultiStateCheckbox } from 'primereact/multistatecheckbox'
import { Button } from 'primereact/button'
import { observer } from 'mobx-react'
import { bibles } from '../bibles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Toast } from 'primereact/toast'
import { Tooltip } from 'primereact/tooltip'

const VerseSelector = observer(props => {
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
  const options = [{ value: true, icon: 'pi pi-minus' }]
  const toast = useRef(null)

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
    // Retrieve the passage afresh if parameters change
    if (verse) {
      const _passageId = `${book.id}.${verse.replace(':', '.')}${
        extended && verseEnd ? `-${verseEnd}` : ''
      }`
      fetchPassage(props.version, _passageId)
    }
  }, [props.version, verse, extended, verseEnd])

  const onChangeBook = e => {
    setBook(e.value)
    if (e.value) {
      const selections = verseSelections(e.value.chapters)
      setVerses(selections)
      setVersesEnd([])
    } else {
      setVerses([])
      setVersesEnd([])
    }
    setVerse(null)
    setVerseEnd(null)
    setPassage({})
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

  const fetchPassage = async (version, passageId) => {
    setLoading(true)
    let ref =
      passageId ||
      `${book.id}.${verse.replace(':', '.')}${
        extended && verseEnd ? `-${verseEnd}` : ''
      }`

    const url = `/verses/${version || bible.abbreviation}/${ref}`
    const response = await axiosClient({
      method: 'get',
      url,
      headers: {
        accept: 'application/json'
      }
    }).then(response => response.data)

    const formatted = formatVerses(response)

    setPassage(formatted)
    if (props.setPassage) props.setPassage(formatted)
    setLoading(false)
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
    }

    return _passage
  }

  const verseRef = `${book.id}.${verse ? verse.replace(':', '.') : ''}${
    extended && verseEnd ? `-${verseEnd}` : ''
  }`

  const chapterNumber = Number(verse ? verse.split(':')[0] : 0)

  const openChapter = _chapterNumber => {
    const chapterRef = `${book.id}.${_chapterNumber}`
    const url = `${
      typeof window !== 'undefined'
        ? window.location.protocol + '//' + window.location.host.split(/\//)[0]
        : ''
    }?r=${chapterRef}&v=${bible.abbreviation}`
    window.open(url)
  }

  const readChapter = _chapterNumber => {
    const _rangeStart = 1
    const _rangeEnd = book.chapters[_chapterNumber]
    const selectionsEnd = verseSelectionsEnd(_rangeStart, _rangeEnd)
    setVersesEnd(selectionsEnd)
    setVerse(`${_chapterNumber}:1`)
    setExtended(true)
    setVerseEnd(_rangeEnd - 1)
  }

  return (
    <>
      <Toast ref={toast} position='top-right'></Toast>
      {props.readOnly ? (
        ''
      ) : (
        <>
          <div className='p-d-inline-flex p-ai-center'>
            <Dropdown
              value={book}
              options={bible && bible.books ? bible.books : []}
              onChange={onChangeBook}
              optionLabel='name'
              placeholder='Book'
              filter
              showClear
              filterBy='name'
            />
            <Dropdown
              value={verse}
              options={verses || []}
              onChange={onChangeVerse}
              placeholder='Verse'
              editable
              style={{ width: 100 }}
              disabled={!book.chapters}
            />
            <MultiStateCheckbox
              style={{ marginLeft: 6, marginRight: 6 }}
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
                  style={{ width: 100 }}
                  disabled={!book.chapters}
                />
              </>
            ) : (
              ''
            )}
          </div>
          <br />
        </>
      )}
      <div className='p-d-inline-flex p-ai-center'>
        {book && verse ? (
          <>
            <h3>
              {`${book.name} ${verse}${
                extended && verseEnd ? `-${verseEnd}` : ''
              } (${bible.abbreviation})`}
            </h3>
            &nbsp;
            {chapterNumber > 1 ? (
              <Button
                className='p-button-rounded p-button-text'
                icon='pi pi-arrow-circle-left'
                onClick={() => readChapter(chapterNumber - 1)}
                tooltip='Previous Chapter'
                tooltipOptions={{ position: 'left' }}
              />
            ) : (
              ''
            )}
            <Button
              className='p-button-rounded p-button-text'
              icon='pi pi-book'
              onClick={() => readChapter(chapterNumber)}
              tooltip='Read Chapter'
              tooltipOptions={{ position: 'left' }}
            />
            {chapterNumber < book.chapters.length ? (
              <Button
                className='p-button-rounded p-button-text'
                icon='pi pi-arrow-circle-right'
                onClick={() => readChapter(chapterNumber + 1)}
                tooltip='Next Chapter'
                tooltipOptions={{ position: 'left' }}
              />
            ) : (
              ''
            )}
            &nbsp;
            <Button
              className='p-button-rounded p-button-text'
              icon='pi pi-window-maximize'
              onClick={() => openChapter(chapterNumber)}
              tooltip='Open Chapter'
              tooltipOptions={{ position: 'left' }}
            />
            &nbsp;
            <CopyToClipboard
              style={{ cursor: 'copy' }}
              text={`${
                typeof window !== 'undefined'
                  ? window.location.host.split(/\//)[0]
                  : ''
              }?r=${verseRef}&v=${bible.abbreviation}`}
              onCopy={() =>
                toast.current.show({
                  severity: 'success',
                  summary: 'Link Copied'
                })
              }
            >
              <i className='pi pi-share-alt'></i>
            </CopyToClipboard>
          </>
        ) : (
          ''
        )}
      </div>
      <br />
      {loading ? (
        <i
          className='pi pi-spin pi-spinner'
          style={{ margin: 10, fontSize: '4em' }}
        ></i>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: passage.html || '' }} />
      )}
    </>
  )
})

export default VerseSelector

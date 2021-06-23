import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Dropdown } from 'primereact/dropdown'
import { MultiStateCheckbox } from 'primereact/multistatecheckbox'
import { Button } from 'primereact/button'
import { observer } from 'mobx-react'
import { bibles } from '../bibles'

const VerseSelector = observer(props => {
  const [bible, setBible] = useState({})
  const [book, setBook] = useState({})
  const [chapters, setChapters] = useState([])
  const [chapter, setChapter] = useState(null)
  const [verses, setVerses] = useState([])
  const [verse, setVerse] = useState(null)
  const [chaptersEnd, setChaptersEnd] = useState([])
  const [chapterEnd, setChapterEnd] = useState(null)
  const [versesEnd, setVersesEnd] = useState([])
  const [verseEnd, setVerseEnd] = useState(null)
  const [passage, setPassage] = useState({})
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [extended, setExtended] = useState('')
  const options = [{ value: true, icon: 'pi pi-minus' }]

  useEffect(() => {
    // If a passage was passed in, set the defaults
    if (props.version) {
      // Set the bible version according to the props that were passed in.
      const findBible = bibles.find(
        b => b.abbreviation === props.passage.version
      )
      setBible(findBible)
    }

    if (props.passage.passageId && bible.books) {
      // Parse the passageId, e.g. 'GEN.1.1-GEN.1.2'
      const refs = props.passage.passageId.split('-')
      const start = refs[0].split('.')
      const findBook = bible.books.find(b => b.id === start[0])
      setBook(findBook)
      setChapters(
        findBook
          ? Array.from(
              { length: findBook.chapters.length },
              (_, i) => i + 1 + ''
            )
          : null
      )
      setChaptersEnd(
        findBook
          ? Array.from(
              { length: findBook.chapters.length },
              (_, i) => i + 1 + ''
            )
          : null
      )
      setChapter(start[1])
      if (start[2]) {
        setVerses(
          Array.from(
            { length: findBook.chapters[Number(start[1])] },
            (_, i) => i + 1 + ''
          )
        )
        setVerse(start[2])
      }
      if (refs[1]) {
        setExtended(true)
        const end = refs[1].split('.')
        setChapterEnd(end[1])
        if (end[2]) {
          setVersesEnd(
            Array.from(
              { length: findBook.chapters[Number(end[1])] },
              (_, i) => i + 1 + ''
            )
          )
          setVerseEnd(end[2])
        }
      }
      setPassage({
        content: props.passage.html,
        reference: props.passage.reference
      })
    }
  }, [props])

  const onChangeBook = e => {
    setBook(e.value)
    setChapters(
      e.value
        ? Array.from({ length: e.value.chapters.length }, (_, i) => i + 1 + '')
        : null
    )
    setChapter(null)
    setVerses({})
    setVerse(null)
    setChaptersEnd(
      e.value
        ? Array.from({ length: e.value.chapters.length }, (_, i) => i + 1 + '')
        : null
    )
    setChapterEnd(null)
    setVersesEnd({})
    setVerseEnd(null)
    setPassage({})
  }

  const onChangeChapter = e => {
    setChapter(e.value)
    setVerses(
      Array.from({ length: book.chapters[e.value - 1] }, (_, i) => i + 1 + '')
    )
    setVerse(1)
    setPassage({})
  }

  const onChangeVerse = e => {
    setVerse(e.value)
    setPassage({})
  }

  const onChangeChapterEnd = e => {
    setChapterEnd(e.value)
    setVersesEnd(
      Array.from({ length: book.chapters[e.value - 1] }, (_, i) => i + 1 + '')
    )
    setVerseEnd(1)
    setPassage({})
  }

  const onChangeVerseEnd = e => {
    setVerseEnd(e.value)
    setPassage({})
  }

  const fetchPassage = async () => {
    setLoading(true)
    let ref = `${book.id}.${chapter}.${verse}`
    if (extended) ref += `-${book.id}.${chapterEnd}.${verseEnd}`
    const url = `https://api.scripture.api.bible/v1/bibles/${bible.id}/passages/${ref}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`
    const response = await axios({
      method: 'get',
      url,
      headers: {
        accept: 'application/json',
        'api-key': props.apiKey
      }
    }).then(response => response.data.data)
    setPassage(response)
    if (props.setPassage) props.setPassage(response)
    setLoading(false)
  }

  return (
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
          value={chapter}
          options={chapters || []}
          onChange={onChangeChapter}
          placeholder='Chapter'
        />
        <Dropdown
          value={verse}
          options={verses || []}
          onChange={onChangeVerse}
          placeholder='Verse'
        />
        <MultiStateCheckbox
          style={{ marginLeft: 6, marginRight: 6 }}
          value={extended}
          options={options}
          optionValue='value'
          onChange={e => setExtended(e.value)}
        />

        {extended ? (
          <>
            <Dropdown
              value={chapterEnd}
              options={chaptersEnd || []}
              onChange={onChangeChapterEnd}
              placeholder='Chapter'
            />
            <Dropdown
              value={verseEnd}
              options={versesEnd || []}
              onChange={onChangeVerseEnd}
              placeholder='Verse'
            />
          </>
        ) : (
          ''
        )}
      </div>
      <br />
      <div className='p-d-inline-flex p-ai-center'>
        {book && chapter > 0 && verse > 0 ? (
          <div>
            <h3>
              {`${book.name} ${chapter}:${verse}`}
              {extended && chapterEnd > 0 && verseEnd > 0
                ? `-${chapterEnd}:${verseEnd}`
                : ''}
            </h3>
            <Button
              style={{ marginLeft: 6 }}
              icon='pi pi-cloud-download'
              className='p-button-rounded'
              onClick={fetchPassage}
              iconPos='right'
              label='Lookup'
            />
          </div>
        ) : (
          ''
        )}
      </div>
      <br />
      {loading ? (
        <i className='pi pi-spin pi-spinner' style={{ fontSize: '2em' }}></i>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: passage.content || '' }} />
      )}
    </>
  )
})

export default VerseSelector

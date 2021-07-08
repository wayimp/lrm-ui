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
  const [verses, setVerses] = useState([])
  const [verse, setVerse] = useState(null)
  const [versesEnd, setVersesEnd] = useState([])
  const [verseEnd, setVerseEnd] = useState(null)
  const [passage, setPassage] = useState({})
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [extended, setExtended] = useState('')
  const options = [{ value: true, icon: 'pi pi-minus' }]

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

  useEffect(() => {
    // If a passage was passed in, set the defaults
    const version = props.version || (props.passage && props.passage.version)
    let findBible
    if (version) {
      // Set the bible version according to the props that were passed in.
      findBible = bibles.find(b => b.abbreviation === version)
      setBible(findBible)
    }

    const passageId =
      props.passageId || (props.passage && props.passage.passageId)
    if (passageId && findBible && findBible.books) {
      // Parse the passageId, e.g. 'GEN.1.1-GEN.1.2'
      const refs = passageId.split('-')
      const start = refs[0].split('.')
      const findBook = findBible.books.find(b => b.id === start[0])
      setBook(findBook)
      const selections = verseSelections(findBook.chapters)
      setVerses(selections)
      setVersesEnd(selections)

      if (start[2]) {
        setVerse(start[1] + ':' + start[2])
      } else {
        setVerse(start[1] + ':1')
        setExtended(true)
        setVerseEnd(start[1] + ':' + findBook.chapters[Number(start[1])])
      }

      if (refs[1]) {
        setExtended(true)
        const end = refs[1].split('.')
        setVerseEnd(end[1] + ':' + end[2])
      }

      if (props.passage && props.passage.html && props.passage.reference) {
        setPassage({
          content: props.passage.html,
          reference: props.passage.reference
        })
      }
    }
  }, [props])

  const onChangeBook = e => {
    setBook(e.value)
    if (e.value) {
      const selections = verseSelections(e.value.chapters)
      setVerses(selections)
      setVersesEnd(selections)
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
    let ref = `${book.id}.${verse.replace(':', '.')}`
    if (extended) ref += `-${book.id}.${verseEnd.replace(':', '.')}`
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
          onChange={e => setExtended(e.value)}
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
      <div className='p-d-inline-flex p-ai-center'>
        {book && verse ? (
          <div>
            <h3>
              {`${book.name} ${verse}`}
              {extended && verseEnd ? `-${verseEnd}` : ''}
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
        <i
          className='pi pi-spin pi-spinner'
          style={{ margin: 10, fontSize: '4em' }}
        ></i>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: passage.content || '' }} />
      )}
    </>
  )
})

export default VerseSelector

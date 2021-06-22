import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CSBVersesTree } from '../../bibles/CSBVersesTree'
const bibleId = 'a556c5305ee15c3f-01' // CSB

import { Dropdown } from 'primereact/dropdown'
import { MultiStateCheckbox } from 'primereact/multistatecheckbox'
import { Button } from 'primereact/button'

const PassageComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
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

  const setContent = passage => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.html = passage.content
    newState.passageId = passage.id
    newState.bibleId = passage.bibleId
    newState.reference = passage.reference
    setState(newState)
  }

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
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${ref}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`
    const response = await axios({
      method: 'get',
      url,
      headers: {
        accept: 'application/json',
        'api-key': props.apiKey
      }
    }).then(response => response.data.data)
    setPassage(response)
    setContent(response)
    setLoading(false)
  }

  switch (mode) {
    case 'display':
      return (
        <>
          <h3>{props.reference}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: props.html
            }}
          ></div>
        </>
      )
      break

    case 'entry':
      return (
        <h3>{props.reference}</h3>
      )
      break

    case 'config':
      return (
        <>
          <div className='p-d-inline-flex'>
            <Dropdown
              className='p-mr-2 p-d-inline'
              value={book}
              options={CSBVersesTree}
              onChange={onChangeBook}
              optionLabel='name'
              placeholder='Book'
              filter
              showClear
              filterBy='name'
            />
            <Dropdown
              className='p-mr-2 p-d-inline'
              value={chapter}
              options={chapters || []}
              onChange={onChangeChapter}
              placeholder='Chapter'
            />
            <Dropdown
              className='p-mr-2 p-d-inline'
              value={verse}
              options={verses || []}
              onChange={onChangeVerse}
              placeholder='Verse'
            />
            <MultiStateCheckbox
              style={{ margin: '0px 8px 8px 8px' }}
              value={extended}
              options={options}
              optionValue='value'
              onChange={e => setExtended(e.value)}
            />

            {extended ? (
              <>
                <Dropdown
                  className='p-mr-2 p-d-inline'
                  value={chapterEnd}
                  options={chaptersEnd || []}
                  onChange={onChangeChapterEnd}
                  placeholder='Chapter'
                />
                <Dropdown
                  className='p-mr-2 p-d-inline'
                  value={verseEnd}
                  options={versesEnd || []}
                  onChange={onChangeVerseEnd}
                  placeholder='Verse'
                />
              </>
            ) : (
              ''
            )}

            {book && chapter > 0 && verse > 0 ? (
              <div className='p-d-inline-flex'>
                <h3 className='p-mr-2 p-d-inline'>
                  {`${book.name} ${chapter}:${verse}`}
                  {extended && chapterEnd > 0 && verseEnd > 0
                    ? `-${chapterEnd}:${verseEnd}`
                    : ''}
                </h3>
                <Button
                  icon='pi pi-cloud-download'
                  className='p-button-rounded p-mr-2 p-d-inline'
                  onClick={fetchPassage}
                />
              </div>
            ) : (
              ''
            )}
            <br />
            {loading ? (
              <i
                className='pi pi-spin pi-spinner'
                style={{ fontSize: '2em' }}
              ></i>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: passage.content || '' }}
              />
            )}
          </div>
          <div>
            <Button
              label='Cancel'
              icon='pi pi-times'
              onClick={() => {
                updateConfig(null)
              }}
              className='p-button-text'
            />
            <Button
              label='OK'
              icon='pi pi-check'
              onClick={() => {
                updateConfig(state)
              }}
              autoFocus
            />
          </div>
        </>
      )
      break

    default:
      return <></>
  }
}

export default PassageComponent

import React, { useState, useEffect } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import axios from 'axios'
import { CSBVersesTree } from '../bibles/CSBVersesTree'
const bibleId = 'a556c5305ee15c3f-01' // CSB

import { Dropdown } from 'primereact/dropdown'

const Page = props => {
  const [bookStart, setBookStart] = useState({})
  const [chaptersStart, setChaptersStart] = useState([])
  const [chapterStart, setChapterStart] = useState(null)
  const [versesStart, setVersesStart] = useState([])
  const [verseStart, setVerseStart] = useState(null)
  const [verseFull, setVerseFull] = useState('')

  const onChangeBook = e => {
    setBookStart(e.value)
    setChaptersStart(
      Array.from({ length: e.value.chapters.length }, (_, i) => i + 1)
    )
    setVersesStart({})
    setVerseStart({})
    setVerseFull({})
  }

  const onChangeChapter = e => {
    setChapterStart(e.value)
    setVersesStart(
      Array.from({ length: bookStart.chapters[e.value - 1] }, (_, i) => i + 1)
    )
    setVerseStart({})
    setVerseFull({})
  }

  const onChangeVerse = e => {
    setVerseStart(e.value)
    const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${bookStart.id}.${chapterStart}.${e.value}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`
    console.log(url)
    axios({
      method: 'get',
      url,
      headers: {
        accept: 'application/json',
        'api-key': props.apiKey
      }
    }).then(response => setVerseFull(response.data.data))
  }

  return (
    <div className='card'>
      <Dropdown
        value={bookStart}
        options={CSBVersesTree}
        onChange={onChangeBook}
        optionLabel='name'
        placeholder='Select a Book'
        filter
        showClear
        filterBy='name'
      />

      <h3>{bookStart && bookStart.name ? bookStart.name : ''}</h3>
      <Dropdown
        value={chapterStart}
        options={chaptersStart || []}
        onChange={onChangeChapter}
        placeholder='Select a Chapter'
      />

      <h3>Chapter: {chapterStart}</h3>

      <Dropdown
        value={verseStart}
        options={versesStart || []}
        onChange={onChangeVerse}
        placeholder='Select a Verse'
      />

      <h3>{`${bookStart.name} ${chapterStart}:${verseStart}`}</h3>

      <div dangerouslySetInnerHTML={{ __html: verseFull.content || '' }} />
    </div>
  )
}

export async function getStaticProps () {
  const store = initializeStore()
  return {
    props: { static: getSnapshot(store), apiKey: process.env.ABS_API_KEY }
  }
}

export default Page

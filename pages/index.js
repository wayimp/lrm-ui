import React, { useState, useEffect } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import axios from 'axios'
import { bibles } from '../bibles'
import { CSBVersesTree } from '../bibles/CSBVersesTree'
//import Select from 'react-select'

import { Dropdown } from 'primereact/dropdown'
import { CascadeSelect } from 'primereact/cascadeselect'

const Page = props => {
  const [bible, setBible] = useState(bibles[0] || {})
  const [bookStart, setBookStart] = useState({})
  const [chapterStart, setChapterStart] = useState({})
  const [versesStart, setVersesStart] = useState({})
  const [verseStart, setVerseStart] = useState({})
  const [verseFull, setVerseFull] = useState({})

  const onChangeBible = e => {
    setBible(e.value)
    setBookStart({})
    setChapterStart({})
    setVersesStart({})
    setVerseStart({})
    setVerseFull({})
  }

  const onChangeBook = e => {
    setBookStart(e.value)
    setChapterStart({})
    setVersesStart({})
    setVerseStart({})
    setVerseFull({})
  }

  const onChangeChapter = e => {
    setChapterStart(e.value)
    const chapterId = e.value && e.value.id ? e.value.id : ''
    axios({
      method: 'get',
      url: `https://api.scripture.api.bible/v1/bibles/${bible.id}/chapters/${chapterId}/verses`,
      headers: {
        accept: 'application/json',
        'api-key': props.apiKey
      }
    }).then(response => setVersesStart(response.data.data))
    setVerseStart({})
    setVerseFull({})
  }

  const onChangeVerse = e => {
    setVerseStart(e.value)
    axios({
      method: 'get',
      url: `https://api.scripture.api.bible/v1/bibles/${bible.id}/verses/${e.value.id}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`,
      headers: {
        accept: 'application/json',
        'api-key': props.apiKey
      }
    }).then(response => setVerseFull(response.data.data))
  }

  return (
    <div className='card'>
      <Dropdown
        value={bible}
        options={bibles}
        onChange={onChangeBible}
        optionLabel='name'
        placeholder='Select a Bible Version'
      />
      <h3>{bible.name}</h3>

      <Dropdown
        value={bookStart}
        options={bible.books}
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
        options={bookStart && bookStart.chapters ? bookStart.chapters : []}
        onChange={onChangeChapter}
        optionLabel='number'
        placeholder='Select a Chapter'
      />

      <h3>
        {chapterStart && chapterStart.number
          ? `Chapter: ${chapterStart.number}`
          : ''}
      </h3>

      <Dropdown
        value={verseStart}
        options={versesStart || []}
        onChange={onChangeVerse}
        optionLabel='reference'
        placeholder='Select a Verse'
      />

      <h3>
        {verseStart && verseStart.reference
          ? `Verse: ${verseStart.reference}`
          : ''}
      </h3>

      {/*
      <Dropdown
        value={verseStart}
        options={CSBVerses || []}
        onChange={onChangeVerse}
        filter
        optionLabel='name'
        placeholder='Select a Verse'
      />
      
      <CascadeSelect
        options={bible.books || []}
        optionLabel={'number'}
        optionGroupLabel={'name'}
        optionGroupChildren={['chapters']}
        style={{ minWidth: '14rem' }}
        placeholder={'Select a Chapter'}
        onChange={onChangeChapter}
      />
    */}
      <div dangerouslySetInnerHTML={{ __html: verseFull.content || '' }} />
    </div>
  )
}

export async function getStaticProps () {
  const store = initializeStore()
  //store.setBibles(bibles)

  return {
    props: { static: getSnapshot(store), apiKey: process.env.ABS_API_KEY }
  }
}

export default Page

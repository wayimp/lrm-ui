import React, { useState, useEffect } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import axios from 'axios'

import { CascadeSelect } from 'primereact/cascadeselect'

const Page = props => {
  const [chapter, setChapter] = useState({})

  const onChangeChapter = e => {
    const chapterId = e.value && e.value.id ? e.value.id : ''
    const chapter = axios({
      method: 'get',
      url: `https://api.scripture.api.bible/v1/bibles/a556c5305ee15c3f-01/chapters/${chapterId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
      headers: {
        accept: 'application/json',
        'api-key': props.apiKey
      }
    }).then(response => setChapter(response.data.data))
  }

  return (
    <div className='card'>
      <h3>Christian Standard Bible</h3>
      <CascadeSelect
        options={props.static.books}
        optionLabel={'number'}
        optionGroupLabel={'name'}
        optionGroupChildren={['chapters']}
        style={{ minWidth: '14rem' }}
        placeholder={'Select a Chapter'}
        onChange={onChangeChapter}
      />
      <h3>{chapter.reference || ''}</h3>
      <div dangerouslySetInnerHTML={{ __html: chapter.content || '' }} />
    </div>
  )
}

export async function getStaticProps () {
  const store = initializeStore()

  const books = await axios({
    method: 'get',
    url:
      'https://api.scripture.api.bible/v1/bibles/a556c5305ee15c3f-01/books?include-chapters=true',
    headers: {
      accept: 'application/json',
      'api-key': process.env.ABS_API_KEY
    }
  }).then(response => response.data.data)

  store.setBooks(books)
  return {
    props: { static: getSnapshot(store), apiKey: process.env.ABS_API_KEY }
  }
}

export default Page

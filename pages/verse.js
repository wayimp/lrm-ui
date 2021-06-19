import React, { useState, useEffect } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import VerseSelector from '../components/VerseSelector'

const Page = props => {
  return (
    <>
      <VerseSelector apiKey={props.apiKey} />
    </>
  )
}

export async function getStaticProps () {
  const store = initializeStore()
  return {
    props: { static: getSnapshot(store), apiKey: process.env.ABS_API_KEY }
  }
}

export default Page

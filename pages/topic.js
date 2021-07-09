import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { axiosClient } from '../axiosClient'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import { bibles } from '../bibles'
import { AutoComplete } from 'primereact/autocomplete'
import { Fieldset } from 'primereact/fieldset'
import { Toast } from 'primereact/toast'
import ContentBlock from '../components/ContentBlock'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

const Topic = props => {
  useEffect(() => {}, [])

  return (
    <Fieldset
      style={{ margin: '0px 0px 10px 0px' }}
      legend={props.topic.sections[0].name}
    >
      {props.topic.sections[0].items.map((item, index) => {
        return <ContentBlock props={item} mode='display' />
      })}
    </Fieldset>
  )
}

export async function getServerSideProps (context) {
  let topic = {}
  let version = ''
  if (context && context.query) {
    if (context.query.id) {
      topic = await axiosClient
        .get(`/topics/${context.query.id}`)
        .then(response => response.data)
    }
    if (context.query.v) {
      version = context.query.v
    }
  }

  const store = initializeStore()

  return {
    props: {
      topic,
      version,
      apiKey: process.env.ABS_API_KEY
    }
  }
}
export default Topic

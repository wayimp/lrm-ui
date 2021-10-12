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
import { ListBox } from 'primereact/listbox'

import { CopyToClipboard } from 'react-copy-to-clipboard'

const Faqs = props => {
  const [selectedTopic, setSelectedTopic] = useState(props.topics[0])

  const toast = useRef(null)

  useEffect(() => {}, [])

  const movePrevious = () => {
    let findIndex = props.topics.findIndex(t => t.title === selectedTopic.title)

    if (findIndex > 0) {
      findIndex--
    } else {
      findIndex = props.topics.length - 1
    }

    setSelectedTopic(props.topics[findIndex])
  }

  const moveNext = () => {
    let findIndex = props.topics.findIndex(t => t.title === selectedTopic.title)

    if (findIndex < props.topics.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    setSelectedTopic(props.topics[findIndex])
  }

  return (
    <div className="p-flex-column p-jc-center" >
      <h3 style={{marginLeft: 30}}>Frequently Asked Questions</h3>
      <div
        className='p-d-flex p-flex-column p-flex-md-row'
        style={{ margin: '10px 10px 10px 10px' }}
      >
        <Toast ref={toast} position='bottom-right'></Toast>
        <ListBox
          value={selectedTopic}
          options={props.topics}
          onChange={e => setSelectedTopic(e.value)}
          optionLabel='title'
          style={{ marginRight: 20, minWidth: 300 }}
        />
        <div className='p-mb-2 p-mr-2'>
          {selectedTopic ? (
            <Fieldset
              style={{ margin: '0px 0px 10px 0px' }}
              legend={
                <div>
                  {selectedTopic.sections[0].name}&nbsp;&nbsp;
                  <CopyToClipboard
                    style={{ cursor: 'copy' }}
                    text={`${
                      typeof window !== 'undefined'
                        ? window.location.protocol + '//' + window.location.host.split(/\//)[0]
                        : ''
                    }?t=${selectedTopic._id}&v=HCSB`}
                    onCopy={() =>
                      toast.current.show({
                        severity: 'success',
                        summary: 'Link Copied'
                      })
                    }
                  >
                    <i className='pi pi-share-alt'></i>
                  </CopyToClipboard>
                </div>
              }
            >
              <div className='p-d-flex p-p-3'>
                <Button
                  type='button'
                  icon='pi pi-arrow-left'
                  className='p-button-rounded p-button-outlined'
                  onClick={movePrevious}
                />
                <Button
                  type='button'
                  icon='pi pi-arrow-right'
                  className='p-ml-auto p-button-rounded p-button-outlined'
                  onClick={moveNext}
                />
              </div>
              {selectedTopic.sections[0].items.map((item, index) => {
                return <ContentBlock key={index} props={item} mode='display' />
              })}
            </Fieldset>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps () {
  const store = initializeStore()

  const topics = await axiosClient
    .get('/topics?category=faqs')
    .then(response => response.data)

  return {
    props: {
      topics,
      store: getSnapshot(store)
    }
  }
}

export default Faqs

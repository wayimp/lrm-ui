import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { bibles } from '../bibles'
import { axiosClient } from '../axiosClient'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import { AutoComplete } from 'primereact/autocomplete'
import { Fieldset } from 'primereact/fieldset'
import { Toast } from 'primereact/toast'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import ContentBlock from '../components/ContentBlock'
import { Toolbar } from 'primereact/toolbar'

const Search = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')

  useEffect(() => {
    const { topic, version, reference } = props

    if (version) {
      setBible(version)
    } else {
      setBible(bibles[0].abbreviation)
    }

    if (topic && topic.sections) {
      let findSection = topic.sections.find(
        section => section.version === version
      )
      if (!findSection) findSection = topic.sections[0]
      setSelectedSection(findSection)
      setSearchTerm(findSection.name)
      setSelectedTopic(topic)
    }
  }, [])

  const onChangeBible = e => {
    if (bible != e.value) {
      setBible(e.value)
      if (selectedTopic && selectedTopic.sections) {
        let findSection = selectedTopic.sections.find(
          section => section.version === e.value
        )
        if (!findSection) findSection = selectedTopic.sections[0]
        setSelectedSection(findSection)
        setSearchTerm(findSection.name)
      }
    }
  }

  const itemTemplate = item => {
    return (
      <span>
        <b>{item.topicName}</b> ({item.tagName})
      </span>
    )
  }

  const searchTags = event => {
    let query = event.query
    let _filteredTags = []

    if (!event.query.trim().length) {
      _filteredTags = [...props.store.topicTags]
    } else {
      _filteredTags = props.store.topicTags.filter(tag => {
        return tag.tagName.toLowerCase().startsWith(event.query.toLowerCase())
      })
    }

    setFilteredTags(_filteredTags)
  }

  const selectTopic = async e => {
    setSearchTerm(e.value.topicName)

    axiosClient({
      method: 'get',
      url: `/topics/${e.value.id}`
    })
      .then(response => {
        // toast.current.show({ severity: 'success', summary: 'Topic Loaded' })
        setSelectedTopic(response.data)
        if (response.data && response.data.sections) {
          let findSection = response.data.sections.find(
            section => section.version === e.value
          )
          if (!findSection) findSection = response.data.sections[0]
          setSelectedSection(findSection)
          setSearchTerm(findSection.name)
        }
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Topic',
          detail: error
        })
      })
  }

  const movePrevious = () => {
    let findIndex = props.topicNames.findIndex(
      tn => tn.topicName === selectedSection.name
    )

    if (findIndex > 0) {
      findIndex--
    } else {
      findIndex = props.topicNames.length - 1
    }

    selectTopic({ value: props.topicNames[findIndex] })
  }

  const moveNext = () => {
    let findIndex = props.topicNames.findIndex(
      tn => tn.topicName === selectedSection.name
    )

    if (findIndex < props.topicNames.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    selectTopic({ value: props.topicNames[findIndex] })
  }

  return (
    <div>
      <Toast ref={toast} position='top-right'></Toast>
      <Toolbar
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000
        }}
        left={
          <div>
            What does the Bible say about...&nbsp;&nbsp;
            <AutoComplete
              style={{ width: 300 }}
              value={searchTerm}
              suggestions={filteredTags}
              completeMethod={searchTags}
              field='tagName'
              itemTemplate={itemTemplate}
              onChange={e => setSearchTerm(e.value)}
              onSelect={selectTopic}
              forceSelection
            />
            &nbsp;&nbsp;&nbsp;
            <Dropdown
              options={props.topicNames}
              onChange={selectTopic}
              forceSelection
              optionLabel='topicName'
              placeholder='Browse Topics'
            />
          </div>
        }
        right={
          <Dropdown
            value={bible}
            options={bibles}
            onChange={onChangeBible}
            optionValue='abbreviation'
            optionLabel='name'
            placeholder='Select a Bible Version'
          />
        }
      />
      <div
        className='p-d-flex p-flex-column p-flex-md-row'
        style={{ margin: '80px 10px 10px 10px' }}
      >
        <div className='p-mb-2 p-mr-2'>
          {selectedSection ? (
            <Fieldset
              style={{ margin: '0px 0px 10px 0px' }}
              legend={
                <div>
                  {selectedSection.name}&nbsp;&nbsp;
                  <CopyToClipboard
                    style={{ cursor: 'copy' }}
                    text={`${window.location.href.split('?')[0]}?t=${
                      selectedTopic._id
                    }&v=${bible}`}
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
              {selectedSection.items.map((item, index) => {
                return <ContentBlock key={index} props={item} mode='display' />
              })}
            </Fieldset>
          ) : (
            ''
          )}
        </div>
        <div className='p-mb-2 p-mr-2'>
          <Fieldset
            style={{ margin: '0px 0px 10px 0px' }}
            legend='Lookup a Passage'
          >
            <ContentBlock
              props={{
                type: 'passage',
                version: bible,
                apiKey: props.apiKey,
                passageId: props.reference ? props.reference : null
              }}
              mode='entry'
            />
          </Fieldset>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps (context) {
  let topic = {}
  let version = ''
  let reference = ''
  if (context && context.query) {
    if (context.query.t) {
      topic = await axiosClient
        .get(`/topics/${context.query.t}`)
        .then(response => response.data)
    }
    if (context.query.v) {
      version = context.query.v
    }
    if (context.query.r) {
      reference = context.query.r
    }
  }

  const topicTags = await axiosClient
    .get('/topicTags?category=topics')
    .then(response => response.data)

  const topicNames = await axiosClient
    .get('/topicNames?category=topics')
    .then(response => response.data)

  const store = initializeStore()

  store.setTopicTags(topicTags)

  return {
    props: {
      topic,
      version,
      reference,
      topicNames,
      store: getSnapshot(store),
      apiKey: process.env.ABS_API_KEY
    }
  }
}

export default Search

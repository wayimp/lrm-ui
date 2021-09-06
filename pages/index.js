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
import { ListBox } from 'primereact/listbox'
import ContentBlock from '../components/ContentBlock'
import { Toolbar } from 'primereact/toolbar'
import { Sidebar } from 'primereact/sidebar'
import Link from 'next/link'
import { Tooltip } from 'primereact/tooltip'
import { TreeSelect } from 'primereact/treeselect'
import uuid from 'react-uuid'

const Search = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')
  const [showPassage, setShowPassage] = useState(false)
  const [visibleSidebar, setVisibleSidebar] = useState(true)

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

    if (reference) {
      setShowPassage(true)
      setVisibleSidebar(false)
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

  const renderLabel = keyword => {
    switch (keyword) {
      case 'topics':
        return 'Topical Bible'
        break
      case 'start':
        return 'Need a Fresh Start?'
        break
      case 'faqs':
        return 'Frequently Asked Questions'
        break
    }
  }

  const groupedItemTemplate = option => {
    return (
      <div className='p-d-flex p-ai-center'>
        <div>{renderLabel(option.key)}</div>
      </div>
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

  const selectTreeTopic = async e => {
    if (e.value && e.value.length > 1) {
      selectTopic(e.value)
    }
  }

  const selectTopic = async id => {
    setSearchTerm('')

    axiosClient({
      method: 'get',
      url: `/topics/${id}`
    })
      .then(response => {
        // toast.current.show({ severity: 'success', summary: 'Topic Loaded' })
        setSelectedTopic(response.data)
        if (response.data && response.data.sections) {
          let findSection = response.data.sections.find(
            section => section.version === bible
          )
          if (!findSection) findSection = response.data.sections[0]
          setSelectedSection(findSection)
          setSearchTerm('')
        }
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Topic'
        })
      })

    setVisibleSidebar(false)
  }

  const topicIndex =
    selectedSection && selectedSection.name
      ? props.topicNames.findIndex(tn => tn.topicName === selectedSection.name)
      : 0

  const movePreviousTopic = () => {
    let findIndex = topicIndex
    if (findIndex > 0) {
      findIndex--
    } else {
      findIndex = props.topicNames.length - 1
    }

    selectTopic(props.topicNames[findIndex].id)
  }

  const moveNextTopic = () => {
    let findIndex = topicIndex
    if (findIndex < props.topicNames.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    selectTopic(props.topicNames[findIndex].id)
  }

  return (
    <div style={{ marginTop: 50 }}>
      <Toast ref={toast} position='bottom-right'></Toast>
      <Toolbar
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000
        }}
        left={
          <>
            <img
              src='/images/logo.png'
              alt='Life Reference Manual'
              style={{ margin: 0, padding: 0, height: 44 }}
            />
            <TreeSelect
              className='p-ml-3 p-mr-3'
              options={props.tree}
              onChange={selectTreeTopic}
              selectionMode='single'
              filter
              placeholder='Browse Topics'
            ></TreeSelect>
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
                onSelect={e => selectTopic(e.value.id)}
                forceSelection
              />
            </div>
          </>
        }
        right={
          <>
            {showPassage ? (
              ''
            ) : (
              <Button
                className='p-button-rounded p-button-text p-button-outlined p-mr-1'
                icon='pi pi-book'
                onClick={() => {
                  setShowPassage(true)
                  setVisibleSidebar(false)
                }}
                tooltip='Open Passage Loolup'
                tooltipOptions={{ position: 'left' }}
              />
            )}
            <Dropdown
              value={bible}
              options={bibles}
              onChange={onChangeBible}
              optionValue='abbreviation'
              optionLabel='name'
              placeholder='Select a Bible Version'
            />
            &nbsp;&nbsp;
            <Tooltip target='.go' content='Purchase Bibles and Support Us' />
            <img
              className='go'
              src='/images/go.png'
              alt='Go Therefore Ministries'
              onClick={() => window.open('https://gothereforeministries.org/')}
              style={{ margin: 0, padding: 0, height: 44 }}
            />
          </>
        }
      />
      <div
        className='p-grid p-dir-row'
        style={{ margin: '80px 10px 10px 10px' }}
      >
        {selectedSection ? (
          <div className='p-m-2 p-col'>
            <Fieldset
              style={{ margin: '0px 0px 10px 0px' }}
              legend={
                <>
                  <h3>Verse References</h3>
                  <Button
                    className='p-button-rounded p-button-text p-button-danger p-button-outlined'
                    icon='pi pi-times'
                    onClick={() => {
                      setSelectedSection(null)
                      setSearchTerm(null)
                      setSelectedTopic(null)
                    }}
                    tooltip='Close'
                    tooltipOptions={{ position: 'left' }}
                  />
                </>
              }
            >
              <div className='p-grid'>
                <div className='p-d-inline-flex p-ai-center'>
                  <div>
                    {topicIndex > 0 ? (
                      <Button
                        type='button'
                        icon='pi pi-arrow-left'
                        className='p-ml-auto p-button-rounded p-button-outlined p-m-2'
                        onClick={movePreviousTopic}
                      />
                    ) : (
                      <span />
                    )}
                  </div>
                  <h3>{selectedSection.name}</h3>&nbsp;&nbsp;
                  <CopyToClipboard
                    style={{ cursor: 'copy' }}
                    text={`${window.location.host.split(/\//)[0]}?t=${
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
                  <div>
                    {topicIndex < props.topicNames.length - 1 ? (
                      <Button
                        type='button'
                        icon='pi pi-arrow-right'
                        className='p-ml-auto p-button-rounded p-button-outlined p-m-2'
                        onClick={moveNextTopic}
                      />
                    ) : (
                      <span />
                    )}
                  </div>
                </div>
              </div>
              {selectedSection.items.map((item, index) => {
                return <ContentBlock key={index} props={item} mode='display' />
              })}
            </Fieldset>
          </div>
        ) : (
          ''
        )}
        {showPassage ? (
          <div className='p-m-2 p-col'>
            <Fieldset
              style={{ margin: '0px 0px 10px 0px' }}
              legend={
                <>
                  <h3>Lookup a Passage</h3>
                  <Button
                    className='p-button-rounded p-button-text p-button-danger p-button-outlined'
                    icon='pi pi-times'
                    onClick={() => setShowPassage(false)}
                    tooltip='Close'
                    tooltipOptions={{ position: 'left' }}
                  />
                </>
              }
            >
              <ContentBlock
                props={{
                  type: 'passage',
                  version: bible,
                  passageId: props.reference ? props.reference : null
                }}
                mode='entry'
              />
            </Fieldset>
          </div>
        ) : (
          ''
        )}
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
    .get('/topicTags')
    .then(response => response.data)

  const topicNames = await axiosClient
    .get('/topicNames')
    .then(response => response.data)

  const topicsByCategory = {}
  await topicNames.map(topic => {
    if (!topicsByCategory.hasOwnProperty(topic.category)) {
      topicsByCategory[topic.category] = []
    }
    topicsByCategory[topic.category].push(topic)
  })

  const tree = []
  tree.push({
    key: '0',
    label: 'Need a Fresh Start?',
    children: topicsByCategory.start.map(t => {
      return {
        key: t.id,
        label: t.topicName
      }
    })
  })
  tree.push({
    key: '1',
    label: 'Frequently Asked Questions',
    children: topicsByCategory.faqs.map(t => {
      return {
        key: t.id,
        label: t.topicName
      }
    })
  })
  tree.push({
    key: '2',
    label: 'Topical Bible',
    children: topicsByCategory.topics.map(t => {
      return {
        key: t.id,
        label: t.topicName
      }
    })
  })

  const store = initializeStore()

  store.setTopicTags(topicTags)

  return {
    props: {
      topic,
      version,
      reference,
      topicNames,
      tree,
      store: getSnapshot(store)
    }
  }
}

export default Search

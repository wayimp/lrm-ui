import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
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
import Link from 'next/link'
import { Tooltip } from 'primereact/tooltip'
import { TreeSelect } from 'primereact/treeselect'
import uuid from 'react-uuid'
import { useMediaQuery } from 'react-responsive'
import { categories } from './static'

const Index = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')
  const [showPassage, setShowPassage] = useState(false)
  const [showCategory, setShowCategory] = useState(true)
  const [categoryLabel, setCategoryLabel] = useState(
    'Welcome to the Life Reference Manual'
  )
  const [selectedCategory, setSelectedCategory] = useState(props.front || [])
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })

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
      if (['topics', 'start', 'faqs'].includes(e.value)) {
        selectCategory(e.value)
      } else {
        selectTopic(e.value)
      }
    }
  }

  const selectCategory = async name => {
    setSearchTerm('')

    const c = categories.find(c => c.value === name)
    setCategoryLabel(c.label)

    axiosClient({
      method: 'get',
      url: `/category/${name}`
    })
      .then(response => {
        setSelectedCategory(response.data || [])
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Section'
        })
      })
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
      <Head>
        <meta property='og:title' content='Life Reference Manual' />
        <meta property='og:description' content='Online Topical Bible' />
        <meta
          property='og:image'
          content='https://www.lifereferencemanual.net/images/logo.png'
        />
      </Head>
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
          <div className='p-d-inline-flex'>
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
          </div>
        }
        right={
          !isMobile ? (
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
          ) : (
            ''
          )
        }
      />
      <Toolbar
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 1000
        }}
        left={
          <div className='p-d-inline-flex'>
            {showPassage ? (
              ''
            ) : (
              <Button
                className='p-button-rounded p-button-text p-button-outlined p-mr-1'
                icon='pi pi-book'
                onClick={() => {
                  setShowPassage(true)
                }}
                tooltip='Open Passage Loolup'
                tooltipOptions={{ position: 'left' }}
              />
            )}
            {!isMobile ? (
              <Dropdown
                value={bible}
                options={bibles}
                onChange={onChangeBible}
                optionValue='abbreviation'
                optionLabel='name'
                placeholder='Select a Bible Version'
              />
            ) : (
              ''
            )}
          </div>
        }
        right={
          <div className='p-d-inline-flex p-ai-center p-m-3'>
            <span style={{ fontSize: 'xx-small' }}>
              LifeReferenceManaul.net was created by Go Therefore Ministries. If
              you'd like to support this ministry or order physical copies of
              the Life Reference Manual, visit www.gothereforeministries.org
            </span>
            <img
              className='go pointer'
              src='/images/go.png'
              alt='Go Therefore Ministries'
              onClick={() => window.open('https://gothereforeministries.org/')}
              style={{ margin: 0, padding: 0, height: 44 }}
            />
          </div>
        }
      />
      <div
        className='p-grid p-dir-row'
        style={{ margin: '80px 10px 100px 10px' }}
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
                    text={`${window.location.protocol +
                      '//' +
                      window.location.host.split(/\//)[0]}?t=${
                      selectedTopic._id
                    }&v=${bible}`}
                    onCopy={() =>
                      toast.current.show({
                        severity: 'success',
                        summary: 'Link Copied'
                      })
                    }
                  >
                    <i className='pi pi-upload'></i>
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

              <div className='p-grid'>
                <div className='p-d-inline-flex p-ai-center p-m-3'>
                  <div>
                    {topicIndex > 0 ? (
                      <Button
                        label={props.topicNames[topicIndex - 1].topicName}
                        type='button'
                        icon='pi pi-arrow-left'
                        className='p-ml-auto p-button-rounded p-button-outlined p-m-2'
                        onClick={movePreviousTopic}
                      />
                    ) : (
                      <span />
                    )}
                  </div>
                  <div>
                    {topicIndex < props.topicNames.length - 1 ? (
                      <Button
                        label={props.topicNames[topicIndex + 1].topicName}
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

              <div className='p-grid'>
                {selectedSection.links &&
                Array.isArray(selectedSection.links) ? (
                  <div className='p-d-inline-flex p-ai-center'>
                    <h3>Related Topics</h3>
                    {selectedSection.links.map(link => (
                      <Button
                        label={link.title}
                        type='button'
                        className='p-ml-auto p-button-rounded p-button-outlined p-m-2'
                        onClick={() => selectTopic(link._id)}
                      />
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </div>
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
        {showCategory && !selectedSection ? (
          <Fieldset
            key='category'
            style={{ margin: '20px 0px 0px 0px' }}
            legend={
              <>
                <h3>{categoryLabel}</h3>
                <Button
                  className='p-button-rounded p-button-text p-button-danger p-button-outlined'
                  icon='pi pi-times'
                  onClick={() => setShowCategory(false)}
                  tooltip='Close'
                  tooltipOptions={{ position: 'left' }}
                />
              </>
            }
          >
            {selectedCategory.map((t, i) => {
              const section = t.sections.find(
                s => s.version === (bible || 'HCSB')
              )
              if (section && section.items) {
                return (
                  <div>
                    <h3>{section.name}</h3>
                    {section.items.map((item, index) => {
                      return (
                        <ContentBlock
                          key={`front-${index}`}
                          props={item}
                          mode='display'
                        />
                      )
                    })}
                  </div>
                )
              }
            })}
          </Fieldset>
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
    key: 'start',
    label: 'Need a Fresh Start?',
    children: topicsByCategory.start.map(t => {
      return {
        key: t.id,
        label: t.topicName
      }
    })
  })
  tree.push({
    key: 'faqs',
    label: 'Frequently Asked Questions',
    children: topicsByCategory.faqs.map(t => {
      return {
        key: t.id,
        label: t.topicName
      }
    })
  })
  tree.push({
    key: 'topics',
    label: 'Topical Bible',
    children: topicsByCategory.topics.map(t => {
      return {
        key: t.id,
        label: t.topicName
      }
    })
  })

  const front = await axiosClient
    .get('/category/front')
    .then(response => response.data)

  const store = initializeStore()

  store.setTopicTags(topicTags)

  return {
    props: {
      topic,
      version,
      reference,
      topicNames,
      tree,
      front,
      store: getSnapshot(store)
    }
  }
}

export default Index

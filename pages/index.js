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
import Link from 'next/link'

const Search = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [selectedQuestionSection, setSelectedQuestionSection] = useState(null)
  const [selectedStart, setSelectedStart] = useState(null)
  const [selectedStartSection, setSelectedStartSection] = useState(null)

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

    selectStart({ value: props.startNames[0] })
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
            section => section.version === bible
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

  const selectQuestion = async e => {
    axiosClient({
      method: 'get',
      url: `/topics/${e.value.id}`
    })
      .then(response => {
        setSelectedQuestion(response.data)
        let findSection = response.data.sections.find(
          section => section.version === bible
        )
        if (!findSection) findSection = response.data.sections[0]
        setSelectedQuestionSection(findSection)
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Question',
          detail: error
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

    selectTopic({ value: props.topicNames[findIndex] })
  }

  const moveNextTopic = () => {
    let findIndex = topicIndex
    if (findIndex < props.topicNames.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    selectTopic({ value: props.topicNames[findIndex] })
  }

  const questionIndex =
    selectedQuestionSection && selectedQuestionSection.name
      ? props.questionNames.findIndex(
          tn => tn.topicName === selectedQuestionSection.name
        )
      : 0

  const movePreviousQuestion = () => {
    let findIndex = questionIndex
    if (findIndex > 0) {
      findIndex--
    } else {
      findIndex = props.questionNames.length - 1
    }

    selectQuestion({ value: props.questionNames[findIndex] })
  }

  const moveNextQuestion = () => {
    let findIndex = questionIndex
    if (findIndex < props.questionNames.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    selectQuestion({ value: props.questionNames[findIndex] })
  }

  const selectStart = async e => {
    axiosClient({
      method: 'get',
      url: `/topics/${e.value.id}`
    })
      .then(response => {
        setSelectedStart(response.data)
        let findSection = response.data.sections.find(
          section => section.version === bible
        )
        if (!findSection) findSection = response.data.sections[0]
        setSelectedStartSection(findSection)
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Start',
          detail: error
        })
      })
  }

  const startIndex =
    selectedStartSection && selectedStartSection.name
      ? props.startNames.findIndex(
          tn => tn.topicName === selectedStartSection.name
        )
      : 0

  const movePreviousStart = () => {
    let findIndex = startIndex
    if (findIndex > 0) {
      findIndex--
    } else {
      findIndex = props.startNames.length - 1
    }

    selectStart({ value: props.startNames[findIndex] })
  }

  const moveNextStart = () => {
    let findIndex = startIndex
    if (findIndex < props.startNames.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    selectStart({ value: props.startNames[findIndex] })
  }

  return (
    <div style={{ marginTop: 50 }}>
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
            &nbsp;
            <Dropdown
              options={props.topicNames}
              onChange={selectTopic}
              forceSelection
              optionLabel='topicName'
              placeholder='Browse Topics'
            />
            &nbsp;
            <Dropdown
              options={props.questionNames}
              onChange={selectQuestion}
              forceSelection
              optionLabel='topicName'
              placeholder='Questions'
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
        className='p-d-flex p-flex-row-reverse'
        style={{ margin: '80px 10px 10px 10px' }}
      >
        <div className='p-m-2'>
          <Fieldset
            style={{ margin: '0px 0px 10px 0px' }}
            legend='Lookup a Passage'
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
          <Fieldset
            style={{ margin: '0px 0px 10px 0px' }}
            legend='Need a Fresh Start?'
          >
            <div className='p-grid'>
              <div className='p-col'>
                {startIndex > 0 ? (
                  <Button
                    type='button'
                    icon='pi pi-arrow-left'
                    className='p-button-rounded p-button-outlined'
                    onClick={movePreviousStart}
                  />
                ) : (
                  <span />
                )}
              </div>
              {selectedStartSection ? (
                <div className='p-d-inline-flex p-ai-center p-col'>
                  <h3>{selectedStartSection.name}</h3>&nbsp;&nbsp;
                  <CopyToClipboard
                    style={{ cursor: 'copy' }}
                    text={`${window.location.host.split(/\//)[0]}?t=${
                      selectedStart._id
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
              ) : (
                ''
              )}
              <div className='p-col'>
                {startIndex < props.startNames.length - 1 ? (
                  <Button
                    type='button'
                    icon='pi pi-arrow-right'
                    className='p-ml-auto p-button-rounded p-button-outlined'
                    onClick={moveNextStart}
                  />
                ) : (
                  <span />
                )}
              </div>
            </div>
            {(selectedStartSection && selectedStartSection.items
              ? selectedStartSection.items
              : []
            ).map((item, index) => {
              return <ContentBlock key={index} props={item} mode='display' />
            })}
          </Fieldset>
        </div>

        {selectedQuestionSection ? (
          <div className='p-m-2'>
            <Fieldset
              style={{ margin: '0px 0px 10px 0px' }}
              legend={
                <>
                  <h3>Questions</h3>
                  <Button
                    className='p-button-rounded p-button-text p-button-danger p-button-outlined'
                    icon='pi pi-times'
                    onClick={() => {
                      setSelectedQuestion(null)
                      setSelectedQuestionSection(null)
                    }}
                    tooltip='Close'
                    tooltipOptions={{ position: 'left' }}
                  />
                </>
              }
            >
              <div className='p-grid'>
                <div className='p-col'>
                  {questionIndex > 0 ? (
                    <Button
                      type='button'
                      icon='pi pi-arrow-left'
                      className='p-button-rounded p-button-outlined'
                      onClick={movePreviousQuestion}
                    />
                  ) : (
                    <span />
                  )}
                </div>
                <div className='p-d-inline-flex p-ai-center p-col'>
                  <h3>{selectedQuestionSection.name}</h3>&nbsp;&nbsp;
                  <CopyToClipboard
                    style={{ cursor: 'copy' }}
                    text={`${window.location.host.split(/\//)[0]}?t=${
                      selectedQuestion._id
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
                <div className='p-col'>
                  {questionIndex < props.questionNames.length - 1 ? (
                    <Button
                      type='button'
                      icon='pi pi-arrow-right'
                      className='p-ml-auto p-button-rounded p-button-outlined'
                      onClick={moveNextQuestion}
                    />
                  ) : (
                    <span />
                  )}
                </div>
              </div>
              {selectedQuestionSection.items.map((item, index) => {
                return <ContentBlock key={index} props={item} mode='display' />
              })}
            </Fieldset>
          </div>
        ) : (
          ''
        )}

        {selectedSection ? (
          <div className='p-m-2'>
            <Fieldset
              style={{ margin: '0px 0px 10px 0px' }}
              legend={
                <>
                  <h3>Topics</h3>
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
                <div className='p-col'>
                  {questionIndex > 0 ? (
                    <Button
                      type='button'
                      icon='pi pi-arrow-left'
                      className='p-button-rounded p-button-outlined'
                      onClick={movePreviousTopic}
                    />
                  ) : (
                    <span />
                  )}
                </div>
                <div className='p-d-inline-flex p-ai-center p-col'>
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
                </div>
                <div className='p-col'>
                  {topicIndex < props.topicNames.length - 1 ? (
                    <Button
                      type='button'
                      icon='pi pi-arrow-right'
                      className='p-ml-auto p-button-rounded p-button-outlined'
                      onClick={moveNextTopic}
                    />
                  ) : (
                    <span />
                  )}
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

  const topicNamesAll = await axiosClient
    .get('/topicNames')
    .then(response => response.data)

  const topicNames = topicNamesAll.filter(t => t.category === 'topics')

  const questionNames = topicNamesAll.filter(t => t.category === 'faqs')

  const startNames = topicNamesAll.filter(t => t.category === 'start')

  const store = initializeStore()

  store.setTopicTags(topicTags)

  return {
    props: {
      topic,
      version,
      reference,
      topicNames,
      questionNames,
      startNames,
      store: getSnapshot(store)
    }
  }
}

export default Search

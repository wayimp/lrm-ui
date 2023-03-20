import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { bibles } from '../bibles'
import { axiosClient } from '../axiosClient'
import { AutoComplete } from 'primereact/autocomplete'
import { Fieldset } from 'primereact/fieldset'
import { Toast } from 'primereact/toast'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import ContentBlock from '../components/ContentBlock'

const Search = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')

  useEffect(() => {
    const { topic, version } = props

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
      _filteredTags = [...props.topicTags]
    } else {
      _filteredTags = props.topicTags.filter(tag => {
        return tag.tagName.toLowerCase().startsWith(event.query.toLowerCase())
      })
    }

    setFilteredTags(_filteredTags)
  }

  const selectTopic = async e => {
    setSearchTerm(e.value.topicName)

    const topic = await axiosClient({
      method: 'get',
      url: `/topics/${e.value.id}`
    })
      .then(response => {
        toast.current.show({ severity: 'success', summary: 'Topic Loaded' })
        return response.data
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Topic'
        })
      })

    setSelectedTopic(topic)
    if (selectedTopic && topic.sections) {
      let findSection = topic.sections.find(
        section => section.version === e.value
      )
      if (!findSection) findSection = topic.sections[0]
      setSelectedSection(findSection)
      setSearchTerm(findSection.name)
    }
  }

  return (
    <div>
      <Toast ref={toast} position='bottom-right'></Toast>
      <Dropdown
        value={bible}
        options={bibles}
        onChange={onChangeBible}
        optionValue='abbreviation'
        optionLabel='name'
        placeholder='Select a Bible Version'
      />
      <p />
      <p />
      <div>
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
          placeholder='Enter Search Words'
        />
        <p />
        <p />
      </div>
      {selectedSection ? (
        <Fieldset
          style={{ margin: '0px 0px 10px 0px' }}
          legend={
            <div>
              {selectedSection.name}&nbsp;&nbsp;
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
            </div>
          }
        >
          {selectedSection.items.map((item, index) => {
            return <ContentBlock key={index} props={item} mode='display' />
          })}
        </Fieldset>
      ) : (
        ''
      )}
      <div>
        <p>Lookup a passage</p>
        <ContentBlock
          props={{
            type: 'passage',
            version: bible
          }}
          mode='entry'
        />
      </div>
    </div>
  )
}

export async function getServerSideProps (context) {
  let topic = {}
  let version = ''
  if (context && context.query) {
    if (context.query.t) {
      topic = await axiosClient
        .get(`/topics/${context.query.t}`)
        .then(response => response.data)
    }
    if (context.query.v) {
      version = context.query.v
    }
  }

  const topicTags = await axiosClient
    .get('/topicTags')
    .then(response => response.data)

  return {
    props: {
      topic,
      version,
      topicTags
    }
  }
}

export default Search

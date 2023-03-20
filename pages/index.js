import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { bibles } from '../bibles'
import { axiosClient } from '../axiosClient'
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
import { categories } from '../static'
import { Menu } from 'primereact/menu'
import { useQueryClient } from 'react-query'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Divider } from 'primereact/divider';

const Index = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [topicId, setTopicId] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')
  const [showPassage, setShowPassage] = useState(false)
  const [showCategory, setShowCategory] = useState(true)
  const [questionDialog, setQuestionDialog] = useState(false)
  const [question, setQuestion] = useState({ name: '', email: '', text: '' })
  const [signupDialog, setSignupDialog] = useState(false)
  const [signup, setSignup] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [categoryLabel, setCategoryLabel] = useState(
    'Welcome to the Life Reference Manual Online'
  )
  const [selectedCategory, setSelectedCategory] = useState(props.front || [])
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })
  const queryClient = useQueryClient()

  const attribution = bibles.find(b => b.abbreviation === bible)
    ?.attribution || ''

  useEffect(() => {
    axios.get('https://ipapi.co/json/').then(response => {
      const { data } = response
      if (data) {
        const { city, country_name, ip, latitude, longitude, region } = data
        axiosClient.post('/metrics/visit', {
          city,
          country_name,
          ip,
          latitude,
          longitude,
          region
        })
      }
    })
  }, [])

  useEffect(() => {
    if (selectedTopic?._id) {
      axiosClient.post('/metrics/topic_read/', {
        tId: selectedTopic._id,
        version: props.version
      })
    }
  }, [selectedTopic])

  const popState = e => {
    if (e.state) {
      const { t, v } = e.state
      if (t) {
        const url = new URL(window.location)
        url.searchParams.set('t', t)
        url.searchParams.set('v', v)
        window.location.href = url
      }
    }
  }

  useEffect(() => {
    window.onpopstate = popState
  }, [])

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
    if (typeof event.query === 'string' || event.query instanceof String) {
      let queryWords = event.query.toLowerCase().split(' ')
      let _filteredTags = []

      if (!event.query.trim().length) {
        _filteredTags = [...props.topicTags]
      } else {
        _filteredTags = props.topicTags.filter(tag =>
          queryWords.some(word => tag.tagName.toLowerCase().includes(word))
        )
      }

      setFilteredTags(_filteredTags)
    }
  }

  const selectTreeTopic = async e => {
    if (e.value && e.value.length > 1) {
      if (['topics', 'start', 'faqs'].includes(e.value)) {
        selectCategory(e.value)
        setShowCategory(true)
        setSelectedSection(null)
      } else {
        selectTopic(e.value)
        setShowCategory(false)
      }
    }
  }

  const showFaqs = () => {
    selectCategory('faqs')
    setShowCategory(true)
    setSelectedSection(null)
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

  const getTopic = async id => {
    const url = `/topics/${id}`
    const { data } = await axiosClient({
      method: 'get',
      url
    })
    return data
  }

  const selectTopic = async id => {
    if (!id) return
    setSearchTerm('')

    const url = new URL(window.location)
    url.searchParams.set('t', id)
    url.searchParams.set('v', bible)
    window.history.pushState({ t: id, v: bible }, 'topic', url)

    try {
      const topic = await queryClient.fetchQuery({
        queryKey: ['topic', id],
        queryFn: () => getTopic(id),
        options: {
          cacheTime: 600000
        }
      })

      if (topic && topic.sections) {
        setSelectedTopic(topic)
        let findSection = topic.sections.find(
          section => section.version === bible
        )
        if (!findSection) findSection = topic.sections[0]
        setSelectedSection(findSection)
      }
    } catch {
      toast.current.show({
        severity: 'error',
        summary: 'Error Loading Topic'
      })
    }

    setTopicId(id)
  }

  const topicIndex =
    selectedSection && selectedSection.name
      ? props.topicNames.findIndex(tn => tn.topicName === selectedSection.name)
      : 0

  if (topicIndex > 0) {
    const previousId = props.topicNames[topicIndex - 1].id
    queryClient.prefetchQuery({
      queryKey: ['topic', previousId],
      queryFn: () => getTopic(previousId),
      options: {
        cacheTime: 600000
      }
    })
  }

  if (topicIndex < props.topicNames.length - 1) {
    const nextId = props.topicNames[topicIndex + 1].id
    queryClient.prefetchQuery({
      queryKey: ['topic', nextId],
      queryFn: () => getTopic(nextId),
      options: {
        cacheTime: 600000
      }
    })
  }

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

  const handleQuestionChange = e => {
    const newQuestion = { ...question }
    newQuestion[e.target.name] = e.target.value
    setQuestion(newQuestion)
  }

  const submitQuestion = async () => {
    const questionTopic = {
      category: 'question',
      name: question.name,
      email: question.email,
      title: question.text
    }

    await axiosClient({
      method: 'post',
      url: '/question',
      data: questionTopic
    })
      .then(async response => {
        setQuestionDialog(false)
        setQuestion({ name: '', email: '', text: '' })
        toast.current.show({
          severity: 'success',
          summary: 'Question Submitted'
        })
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Submitting Question'
        })
      })
  }

  const handleSignupChange = e => {
    const _signup = { ...signup }
    _signup[e.target.name] = e.target.value
    setSignup(_signup)
  }

  const submitSignup = async () => {
    await axiosClient({
      method: 'post',
      url: '/signup',
      data: signup
    })
      .then(async response => {
        setSignupDialog(false)
        setSignup({ firstName: '', lastName: '', email: '' })
        toast.current.show({
          severity: 'success',
          summary: 'Email Submitted'
        })
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Submitting Email'
        })
      })
  }

  return (
    <div style={{ marginTop: 50 }}>
      <Head>
        <meta
          property='og:title'
          content={
            props.topic && props.topic.sections && props.version
              ? props.topic.sections.find(s => s.version === props.version).name
              : 'Life Reference Manual'
          }
        />
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
              style={{ margin: 0, padding: 0, height: 44, cursor: 'pointer' }}
              onClick={() => (window.location.href = '/')}
            />
            <TreeSelect
              className='p-ml-3 p-mr-3'
              options={props.tree}
              onChange={selectTreeTopic}
              selectionMode='single'
              filter
              placeholder='Browse Topics'
            ></TreeSelect>
            <div style={{ marginTop: 10, cursor: 'pointer' }} onClick={() => showFaqs()} >FAQs</div>
            &nbsp;&nbsp;&nbsp;
            <div style={{ marginTop: 10, cursor: 'pointer' }} onClick={() => window.open('https://gothereforeministries.org/')} >Order</div>
            &nbsp;&nbsp;&nbsp;
            <div style={{ marginTop: 10, cursor: 'pointer' }} onClick={() => {
              setShowPassage(true)
            }} >Read</div>
          </div>
        }
        right={
          <>
            {!isMobile ? (
              <div>
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
                  placeholder='Enter Search Words'
                />
              </div>
            ) : (
              ''
            )}
            <Button
              className='p-button-rounded p-button-text p-button-outlined p-mr-1'
              icon='pi pi-envelope'
              onClick={() => {
                setSignupDialog(true)
              }}
              tooltip='Subscribe to Newsletter'
              tooltipOptions={{ position: 'left' }}
            />
            <Button
              className='p-button-rounded p-button-text p-button-outlined p-mr-1'
              icon='pi pi-sun'
              onClick={() => {
                // Generate a random number
                const random = Math.floor(
                  Math.random() * props.topicNames.length
                )
                selectTopic(props.topicNames[random].id)
              }}
              tooltip='Random Topic'
              tooltipOptions={{ position: 'left' }}
            />
            <Button
              className='p-button-rounded p-button-text p-button-outlined p-mr-1'
              icon='pi pi-question-circle'
              onClick={() => {
                setQuestionDialog(true)
              }}
              tooltip='Ask a Question'
              tooltipOptions={{ position: 'left' }}
            />
          </>
        }
      />
      < Toolbar
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 1000
        }}
        left={
          < div className='p-d-inline-flex p-ai-center' >
            {
              showPassage ? (
                ''
              ) : (
                <Button
                  className='p-button-rounded p-button-text p-button-outlined p-mr-1'
                  icon='pi pi-book'
                  onClick={
                    () => {
                      setShowPassage(true)
                    }
                  }
                  tooltip='Open Passage Lookup'
                  tooltipOptions={{ position: 'left' }}
                />
              )}
            {
              !isMobile ? (
                <>
                  <Dropdown
                    value={bible}
                    options={bibles}
                    onChange={onChangeBible}
                    optionValue='abbreviation'
                    optionLabel='name'
                    placeholder='Select a Bible Version'
                  />
                  &nbsp;&nbsp;
                  <div dangerouslySetInnerHTML={{ __html: attribution }} />
                </>
              ) : (
                ''
              )
            }
          </div >
        }
        right={
          < div className='p-d-inline-flex p-ai-center' >
            <span style={{ fontSize: 'x-small' }}>
              Support our Ministry
              <br />
              Order Physical Copies
            </span>
            <img
              className='go pointer p-ml-2'
              src='/images/go.png'
              alt='Go Therefore Ministries'
              style={{ margin: 0, padding: 0, height: 44 }}
              onClick={() => window.open('https://gothereforeministries.org/')}
            />
          </div >
        }
      />
      < div
        className='p-grid p-dir-row'
        style={{ margin: '80px 10px 100px 10px' }}
      >
        {
          selectedSection ? (
            <div className='p-m-2 p-col' >
              <Fieldset
                style={{ margin: '0px 0px 10px 0px' }}
                legend={
                  <>
                    <h2>Topics&nbsp;&amp;&nbsp;References</h2>
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
                <div className='grid'>
                  <div className='p-d-inline-flex p-ai-center'>
                    <div>
                      {topicIndex > 0 ? (
                        <Button
                          type='button'
                          icon='pi pi-chevron-left'
                          className='p-ml-auto p-button-rounded p-button-outlined p-m-2'
                          onClick={movePreviousTopic}
                        />
                      ) : (
                        <span />
                      )}
                    </div>
                    <h3>{selectedSection.name}</h3>
                    &nbsp;&nbsp;
                    <CopyToClipboard
                      style={{ cursor: 'copy' }}
                      text={`${window.location.protocol +
                        '//' +
                        window.location.host.split(/\//)[0]}?t=${selectedTopic._id
                        }&v=${bible}`}
                      onCopy={() => {
                        axiosClient.post('/metrics/topic_copied', {
                          tId: selectedTopic._id,
                          version: bible
                        })
                        toast.current.show({
                          severity: 'success',
                          summary: 'Link Copied'
                        })
                      }}
                    >
                      <i className='pi pi-upload'></i>
                    </CopyToClipboard>
                    <div>
                      {topicIndex < props.topicNames.length - 1 ? (
                        <Button
                          type='button'
                          icon='pi pi-chevron-right'
                          className='p-ml-auto p-button-rounded p-button-outlined p-m-2'
                          onClick={moveNextTopic}
                        />
                      ) : (
                        <span />
                      )}
                    </div>
                  </div>
                  <Divider />
                </div>
                {selectedSection.items.map((item, index) => {
                  return (
                    <ContentBlock
                      key={`content-${index}`}
                      props={item}
                      mode='display'
                    />
                  )
                })}

                <div className='p-grid'>
                  <Divider />
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
                      {selectedSection.links.map((link, index) => (
                        <Button
                          key={`link-${index}`}
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
        {
          showPassage ? (
            <div className='p-m-2 p-col'>
              <Fieldset
                style={{ margin: '0px 0px 10px 0px' }}
                legend={
                  <>
                    <h2>Lookup a Passage</h2>
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
                    type: 'tile',
                    version: bible,
                    passageId: props.reference ? props.reference : null
                  }}
                  mode='entry'
                />
              </Fieldset>
            </div>
          ) : (
            ''
          )
        }
        {
          showCategory && !selectedSection ? (

            categoryLabel.startsWith('Welcome')
              ?
              <div>
                <div class='flex justify-content-center'>
                  <img src='https://tanque.nyc3.digitaloceanspaces.com/up/life-reference-manual-6th-small.png' />
                  <img src='/images/logo-blue.png' />
                </div>
                {selectedCategory.map((t, i) => {
                  const section = t.sections.find(
                    s => s.version === (bible || 'HCSB')
                  )
                  if (section && section.items) {
                    return (
                      <div key={`section-${i}`}>
                        <h3 className='p-mt-5'>
                          {section.name}
                        </h3>
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
              </div>
              :
              <Fieldset
                key='category'
                style={{ margin: '20px 0px 0px 0px' }}
                legend={
                  <>
                    <h2>{categoryLabel}</h2>
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
                      <div key={`section-${i}`}>
                        <h3 className='p-mt-5'>
                          {section.name}
                        </h3>
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
          )
        }
      </div >
      <Dialog
        header='Ask a Question'
        visible={questionDialog}
        style={{ width: '80vw' }}
        onHide={() => setQuestionDialog(false)}
      >
        <div className='p-field p-grid'>
          <label htmlFor='name'>Name:</label>
          <div className='p-col-12 p-md-10'>
            <InputText
              type='text'
              name='name'
              value={question.name}
              onChange={handleQuestionChange}
            />
          </div>
        </div>
        <div className='p-field p-grid'>
          <label htmlFor='email'>Email:</label>
          <div className='p-col-12 p-md-10'>
            <InputText
              type='text'
              name='email'
              value={question.email}
              onChange={handleQuestionChange}
            />
          </div>
        </div>
        <div className='p-field p-grid'>
          <label htmlFor='text'>Question:</label>
          <div className='p-col-12 p-md-10'>
            <InputTextarea
              type='text'
              name='text'
              value={question.text}
              onChange={handleQuestionChange}
              rows={5}
              cols={30}
              autoResize
            />
          </div>
        </div>
        <div className='p-d-flex p-ai-center p-jc-end'>
          <Button
            label='Cancel'
            icon='pi pi-times'
            onClick={() => setQuestionDialog(false)}
            className='p-button-text'
          />
          &nbsp;
          <Button
            label='Send'
            icon='pi pi-send'
            onClick={() => submitQuestion()}
            autoFocus
          />
        </div>
      </Dialog>
      <Dialog
        header='Newsletter Signup'
        visible={signupDialog}
        style={{ width: '80vw' }}
        onHide={() => setSignupDialog(false)}
      >
        <div className='p-field p-grid'>
          <label htmlFor='firstName'>First Name:</label>
          <div className='p-col-12 p-md-10'>
            <InputText
              type='text'
              name='firstName'
              value={signup.firstName}
              onChange={handleSignupChange}
            />
          </div>
        </div>
        <div className='p-field p-grid'>
          <label htmlFor='name'>Last Name:</label>
          <div className='p-col-12 p-md-10'>
            <InputText
              type='text'
              name='lastName'
              value={signup.lastName}
              onChange={handleSignupChange}
            />
          </div>
        </div>
        <div className='p-field p-grid'>
          <label htmlFor='email'>Email:</label>
          <div className='p-col-12 p-md-10'>
            <InputText
              type='text'
              name='email'
              value={signup.email}
              onChange={handleSignupChange}
            />
          </div>
        </div>
        <div className='p-d-flex p-ai-center p-jc-end'>
          <Button
            label='Cancel'
            icon='pi pi-times'
            onClick={() => setSignupDialog(false)}
            className='p-button-text'
          />
          &nbsp;
          <Button
            label='Send'
            icon='pi pi-send'
            onClick={() => submitSignup()}
            autoFocus
          />
        </div>
      </Dialog>
    </div >
  )
}

export async function getServerSideProps(context) {
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

  return {
    props: {
      topic,
      version,
      reference,
      topicTags,
      topicNames,
      tree,
      front
    }
  }
}

export default Index

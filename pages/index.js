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
import uuid from 'react-uuid'
import { useMediaQuery } from 'react-responsive'
import { categories } from '../static'
import { Menu } from 'primereact/menu'
import { useQueryClient } from 'react-query'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Ripple } from 'primereact/ripple'

const panelTemplate = (options) => {
  const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
  const className = `${options.className} justify-content-start`;
  const titleClassName = `${options.titleClassName} ml-2 text-primary`;
  const style = { fontSize: '1.25rem' };

  return (
    <div className={className}>
      <button className={options.togglerClassName} onClick={options.onTogglerClick}>
        <span className={toggleIcon}></span>
        <Ripple />
      </button>
      <span className={titleClassName} style={style}>{options.titleElement}</span>

    </div>
  );
};

const Index = props => {
  const toast = useRef(null)

  const [searchTerm, setSearchTerm] = useState(null)
  const [filteredTags, setFilteredTags] = useState(null)
  const [topicId, setTopicId] = useState(null)
  const [topics, setTopics] = useState({})
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [bible, setBible] = useState('')
  const [showPassage, setShowPassage] = useState(false)
  const [showCategory, setShowCategory] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(false)
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
  const versionNames = props.topicNames?.filter(t => t.version == bible)
  const attribution = bibles.find(b => b.abbreviation === bible)
    ?.attribution || ''

  const titleStyle = { cursor: 'pointer', fontFamily: 'Calibri', fontSize: '16px', fontStyle: 'normal' }

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
        <b>{item.topicName}</b>
      </span>
    )
  }

  const renderLabel = keyword => {
    switch (keyword) {
      case 'topics':
        return bible == 'NVI' ? 'Biblia Temática' : 'Topical Bible'
        break
      case 'start':
        return bible == 'NVI' ? '¿Necesita un nuevo comienzo?' : 'Need a Fresh Start?'
        break
      case 'faqs':
        return bible == 'NVI' ? 'Preguntas Frecuentes' : 'FAQ'
        break
    }
  }

  const groupedItemTemplate = option => {
    return (
      <div className='flex align-content-center'>
        <div className='m-2'>{renderLabel(option.key)}</div>
      </div>
    )
  }

  const searchTags = event => {
    if (typeof event.query === 'string' || event.query instanceof String) {
      let queryWords = event.query.toLowerCase()
      let _filteredTags = []

      if (!event.query.trim().length) {
        _filteredTags = [...props.topicNames]
      } else {
        _filteredTags = props.topicNames.filter(tag =>
          tag.version == bible &&
          tag.topicName.toLowerCase().includes(queryWords)
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

  const showCat = c => {
    selectCategory(c)
    setShowCategory(true)
    setSelectedSection(null)
    setShowPassage(false)
  }

  const selectCategory = async name => {
    setSearchTerm('')

    //const c = categories.find(c => c.value === name)
    setCategoryLabel(renderLabel(name))

    const categoryTopics = versionNames?.filter(topic => topic.category == name)
    setSelectedCategory(categoryTopics)

    /*
    setCategoryLoading(true)
    axiosClient({
      method: 'get',
      url: `/category/${name}`
    })
      .then(response => {
        setSelectedCategory(response.data || [])
        setCategoryLoading(false)
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Section'
        })
        setCategoryLoading(false)
      })
    */
  }

  const getTopic = async id => {
    const url = `/topics/${id}`
    const { data } = await axiosClient({
      method: 'get',
      url
    })
    return data
  }

  const expandTopic = async id => {
    try {
      const topic = await queryClient.fetchQuery({
        queryKey: ['topic', id],
        queryFn: () => getTopic(id),
        options: {
          cacheTime: 600000
        }
      })

      if (topic && topic.sections) {
        setTopics({ ...topics, [id]: topic })
      }
    } catch {
      toast.current.show({
        severity: 'error',
        summary: 'Error Loading Topic'
      })
    }
  }

  const getTopicContent = id => {
    const content = []
    if (topics[id]) {
      const section = topics[id].sections.find(
        s => s.version === (bible || 'HCSB')
      )
      if (section && section.items) {
        content.push(
          <div>
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
    }
    else {
      content.push(<></>)
    }
    return content
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
      ? versionNames?.findIndex(tn => tn.topicName === selectedSection.name)
      : 0

  if (topicIndex > 0) {
    const previousId = versionNames[topicIndex - 1].id
    queryClient.prefetchQuery({
      queryKey: ['topic', previousId],
      queryFn: () => getTopic(previousId),
      options: {
        cacheTime: 600000
      }
    })
  }

  if (topicIndex < versionNames?.length - 1) {
    const nextId = versionNames[topicIndex + 1].id
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
      findIndex = versionNames?.length - 1
    }

    selectTopic(versionNames[findIndex].id)
  }

  const moveNextTopic = () => {
    let findIndex = topicIndex
    if (findIndex < versionNames?.length - 1) {
      findIndex++
    } else {
      findIndex = 0
    }

    selectTopic(versionNames[findIndex].id)
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
    <div style={{ marginTop: 120 }}>
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
        start={
          <div className='flex'>
            <img
              src='/images/logo.png'
              alt='Life Reference Manual'
              style={{ marginRight: 20, padding: 0, height: 44, cursor: 'pointer' }}
              onClick={() => (window.location.href = '/')}
            />
          </div>
        }
        center={
          <div class='flex align-content-center text-sm' >
            <div class='flex align-items-center' style={titleStyle} onClick={() => {
              showCat('start')
            }} >{renderLabel('start')?.toUpperCase()}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class='flex align-items-center' style={titleStyle} onClick={() => {
              showCat('faqs')
            }} >{renderLabel('faqs')?.toUpperCase()}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class='flex align-items-center' style={titleStyle} onClick={() => {
              showCat('topics')
            }} >{renderLabel('topics')?.toUpperCase()}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class='flex align-items-center' style={titleStyle} onClick={() => window.open('https://gothereforeministries.org?t=1')} >{bible == 'NVI' ? 'SOLICITAR COPIAS' : 'ORDER COPIES'}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <div class='flex align-items-center' style={titleStyle} onClick={() => window.open('https://gothereforeministries.org?t=3')} >{bible == 'NVI' ? 'ASOCIATE CON NOSOTROS' : 'PARTNER WITH US'}</div>
          </div>
        }
        end={
          <div className='flex flex-row align-items-end'>
            {!isMobile ? (
              <div>
                <AutoComplete
                  style={{ width: 210 }}
                  value={searchTerm}
                  suggestions={filteredTags}
                  completeMethod={searchTags}
                  field='tagName'
                  itemTemplate={itemTemplate}
                  onChange={e => setSearchTerm(e.value)}
                  onSelect={e => selectTopic(e.value.id)}
                  forceSelection
                  placeholder={bible == 'NVI' ? 'Palabras de Búsqueda' : 'Enter Search Words'}
                />
              </div>
            ) : (
              ''
            )}
            <Button
              className='button-rounded button-text button-outlined mr-1'
              icon='pi pi-envelope'
              onClick={() => {
                setSignupDialog(true)
              }}
              tooltip={bible == 'NVI' ? 'Suscríbete al boletín' : 'Subscribe to Newsletter'}
              tooltipOptions={{ position: 'left' }}
            />
            <Button
              className='button-rounded button-text button-outlined mr-1'
              icon='pi pi-sun'
              onClick={() => {
                // Generate a random number
                const random = Math.floor(
                  Math.random() * versionNames?.length
                )
                selectTopic(versionNames[random].id)
              }}
              tooltip={bible == 'NVI' ? 'Tema aleatorio' : 'Random Topic'}
              tooltipOptions={{ position: 'left' }}
            />
            <Button
              className='button-rounded button-text button-outlined mr-1'
              icon='pi pi-question-circle'
              onClick={() => {
                setQuestionDialog(true)
              }}
              tooltip={bible == 'NVI' ? 'Hacer una pregunta' : 'Ask a Question'}
              tooltipOptions={{ position: 'left' }}
            />
          </div>
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
          <div className='flex align-content-center'>
            {
              showPassage ? (
                ''
              ) : (
                <Button
                  className='button-rounded button-text button-outlined mr-1'
                  icon='pi pi-book'
                  onClick={
                    () => {
                      setShowPassage(true)
                    }
                  }
                  tooltip={bible == 'NVI' ? 'Abrir Búsqueda de Pasajes' : 'Open Passage Lookup'}
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
            <div className='flex align-items-center' dangerouslySetInnerHTML={{ __html: attribution }} />
          </div >
        }
        right={
          <div className='flex align-content-center' >
            <div className='flex align-items-center' style={{ fontSize: 'x-small' }}>
              {bible == 'NVI' ? 'Apoya a nuestro Ministerio' : 'Support our Ministry'}
              <br />
              {bible == 'NVI' ? 'Pedir copias físicas' : 'Order Physical Copies'}
            </div>
            <img
              className='go pointer ml-5'
              src='/images/go.png'
              alt='Go Therefore Ministries'
              style={{ margin: 0, padding: 0, height: 44 }}
              onClick={() => window.open('https://gothereforeministries.org/')}
            />
          </div >
        }
      />
      < div
        className='grid dir-row'
        style={{ margin: '100px' }}
      >
        {
          selectedSection ? (
            <div className='m-2 col' >
              <div className='flex justify-content-center flex-wrap'>
                <div class='flex align-items-center justify-content-center'>
                  <h1 >{bible == 'NVI' ? 'Temas' : 'Topics'}</h1>
                  <Button
                    rounded outlined
                    className='button-rounded button-text button-danger button-outlined ml-4'
                    icon='pi pi-times'
                    onClick={() => {
                      setSelectedSection(null)
                      setSearchTerm(null)
                      setSelectedTopic(null)
                    }}
                    tooltip='Close'
                    tooltipOptions={{ position: 'left' }}
                  />
                </div>
              </div>
              <hr style={{ height: '3px', backgroundColor: 'navy' }} />
              <br />
              <div className='flex justify-content-center flex-wrap'>
                <div class='flex align-items-center justify-content-center'>
                  {topicIndex > 0 ? (
                    <Button
                      rounded outlined
                      type='button'
                      icon='pi pi-chevron-left'
                      className='button-rounded button-outlined m-4'
                      onClick={movePreviousTopic}
                    />
                  ) : (
                    <span />
                  )}
                </div>
                <h2 className='flex align-items-center'>{selectedSection.name}</h2>
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
                      summary: bible == 'NVI' ? 'Enlace copiado' : 'Link Copied'
                    })
                  }}
                >
                  <div className='flex align-items-center'>
                    <i className='pi pi-copy' />
                  </div>
                </CopyToClipboard>
                <div>
                  {topicIndex < versionNames?.length - 1 ? (
                    <Button
                      rounded outlined
                      type='button'
                      icon='pi pi-chevron-right'
                      className='button-rounded button-outlined m-4'
                      onClick={moveNextTopic}
                    />
                  ) : (
                    <span />
                  )}
                </div>
              </div>
              <Divider />

              {selectedSection.items.map((item, index) => {
                return (
                  <ContentBlock
                    key={`content-${index}`}
                    props={item}
                    mode='display'
                  />
                )
              })}

              <div className='grid'>
                <Divider />
                <div className='flex align-content-center m-3'>
                  <div>
                    {topicIndex > 0 ? (
                      <Button
                        label={versionNames[topicIndex - 1].topicName}
                        type='button'
                        icon='pi pi-arrow-left'
                        className='ml-auto button-rounded button-outlined m-2'
                        onClick={movePreviousTopic}
                      />
                    ) : (
                      <span />
                    )}
                  </div>
                  <div>
                    {topicIndex < versionNames?.length - 1 ? (
                      <Button
                        label={versionNames[topicIndex + 1].topicName}
                        type='button'
                        icon='pi pi-arrow-right'
                        className='ml-auto button-rounded button-outlined m-2'
                        onClick={moveNextTopic}
                      />
                    ) : (
                      <span />
                    )}
                  </div>
                </div>
              </div>

              <div className='grid'>
                {selectedSection.links &&
                  Array.isArray(selectedSection.links) ? (
                  <div className='flex align-items-center'>
                    <h3>Related Topics&nbsp;&nbsp;</h3>
                    {selectedSection.links.map((link, index) => (
                      <Button
                        key={`link-${index}`}
                        label={link.title}
                        type='button'
                        className='ml-auto button-rounded button-outlined m-2'
                        onClick={() => selectTopic(link._id)}
                      />
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        {
          showPassage ? (
            <div className='m-2 col'>
              <div className='flex justify-content-center flex-wrap'>
                <div class="flex align-items-center justify-content-center">
                  <h1>{bible == 'NVI' ? 'Búsqueda de Pasajes' : 'Lookup a Passage'}</h1>
                  <Button
                    rounded outlined
                    className='button-rounded button-text button-danger button-outlined ml-4'
                    icon='pi pi-times'
                    onClick={() => setShowPassage(false)}
                    tooltip='Close'
                    tooltipOptions={{ position: 'left' }}
                  />
                </div>
              </div>
              <hr style={{ height: '3px', backgroundColor: 'navy' }} />
              <br /><br />
              <ContentBlock
                props={{
                  type: 'tile',
                  version: bible,
                  passageId: props.reference ? props.reference : null
                }}
                mode='entry'
              />
            </div>
          ) : (
            ''
          )
        }
        {
          showCategory && !selectedSection && !showPassage ?
            categoryLabel.startsWith('Welcome')
              ?
              <>
                <div className='flex flex-row justify-content-center flex-grow-1 mt-2'>
                  <img src='https://tanque.nyc3.digitaloceanspaces.com/up/life-reference-manual-6th-small.png' style={{ float: 'left', maxHeight: 180 }} />
                  <img src='/images/welcome.png' style={{ maxHeight: 160 }} />
                </div>
                <div>
                  <ContentBlock
                    props={{
                      type: 'tile',
                      version: bible,
                      passageId: props.reference ? props.reference : null
                    }}
                    mode='entry'
                  />
                  {selectedCategory.length > 0 ? <Divider /> : <></>}
                  {
                    selectedCategory.map((t, i) => {
                      const section = t.sections.find(
                        s => s.version === (bible || 'HCSB')
                      )
                      if (section && section.items) {
                        return (
                          <div key={`section-${i}`}>
                            <h3 className='mt-5'>
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
                  {/*
                  <div className='flex flex-row justify-content-center flex-grow-1 mt-6'>
                    <img
                      className='go pointer ml-5'
                      src='/images/go-grey.png'
                      alt='Go Therefore Ministries'
                      style={{ margin: 0, padding: 0, height: 44 }}
                      onClick={() => window.open('https://gothereforeministries.org/')}
                    />
                  </div>
                  */}
                </div>
              </>
              :
              <div className='m-2 col'>
                <div className='flex justify-content-center flex-wrap'>
                  <div class="flex align-items-center justify-content-center">
                    <h1 >{categoryLabel}</h1>
                  </div>
                </div>
                <hr style={{ height: '3px', backgroundColor: 'navy' }} />
                <br /><br />
                {selectedCategory.map((t, i) => {
                  if (t.version == bible) {
                    return (
                      <Panel
                        headerTemplate={panelTemplate}
                        header={<div className='flex align-content-center'>
                          <h3>{t.topicName}</h3>&nbsp;&nbsp;
                          <CopyToClipboard
                            style={{ cursor: 'copy' }}
                            text={`${window.location.protocol +
                              '//' +
                              window.location.host.split(/\//)[0]}?t=${t.id
                              }&v=${bible}`}
                            onCopy={() => {
                              axiosClient.post('/metrics/topic_copied', {
                                tId: t.id,
                                version: bible
                              })
                              toast.current.show({
                                severity: 'success',
                                summary: bible == 'NVI' ? 'Enlace copiado' : 'Link Copied'
                              })
                            }}
                          >
                            <div className='flex align-items-center'>
                              <i className='pi pi-copy' />
                            </div>
                          </CopyToClipboard>
                        </div>}
                        key={`section-${i}`}
                        onExpand={() => expandTopic(t.id)}
                        toggleable
                        collapsed
                      >
                        {getTopicContent(t.id)}
                      </Panel>
                    )
                  }
                  else
                    return <></>
                }
                )}
              </div>
            :
            <></>
        }

      </div >
      <Dialog
        header={bible == 'NVI' ? 'Hacer una Pregunta' : 'Ask a Question'}
        visible={questionDialog}
        style={{ width: '80vw' }}
        onHide={() => setQuestionDialog(false)}
      >
        <div className='field grid'>
          <label htmlFor='name'>{bible == 'NVI' ? 'Nombre' : 'Name'}:</label>
          <div className='col-12 md-10'>
            <InputText
              type='text'
              name='name'
              value={question.name}
              onChange={handleQuestionChange}
            />
          </div>
        </div>
        <div className='field grid'>
          <label htmlFor='email'>{bible == 'NVI' ? 'Correo Electrónico' : 'Email'}:</label>
          <div className='col-12 md-10'>
            <InputText
              type='text'
              name='email'
              value={question.email}
              onChange={handleQuestionChange}
            />
          </div>
        </div>
        <div className='field grid'>
          <label htmlFor='text'>{bible == 'NVI' ? 'Pregunta' : 'Question'}:</label>
          <div className='col-12 md-10'>
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
        <div className='flex align-content-center justify-content-end'>
          <Button
            label={bible == 'NVI' ? 'Cancelar' : 'Cancel'}
            icon='pi pi-times'
            onClick={() => setQuestionDialog(false)}
            className='button-text ml-4'
          />
          &nbsp;
          <Button
            label={bible == 'NVI' ? 'Enviar' : 'Send'}
            icon='pi pi-send'
            onClick={() => submitQuestion()}
            autoFocus
          />
        </div>
      </Dialog>
      <Dialog
        header={bible == 'NVI' ? 'Inscríbase al Boletín' : 'Newsletter Signup'}
        visible={signupDialog}
        style={{ width: '80vw' }}
        onHide={() => setSignupDialog(false)}
      >
        <div className='field grid'>
          <label htmlFor='firstName'>{bible == 'NVI' ? 'Nombre de Pila' : 'First Name'}:</label>
          <div className='col-12 md-10'>
            <InputText
              type='text'
              name='firstName'
              value={signup.firstName}
              onChange={handleSignupChange}
            />
          </div>
        </div>
        <div className='field grid'>
          <label htmlFor='name'>{bible == 'NVI' ? 'Apellido' : 'Last Name'}:</label>
          <div className='col-12 md-10'>
            <InputText
              type='text'
              name='lastName'
              value={signup.lastName}
              onChange={handleSignupChange}
            />
          </div>
        </div>
        <div className='field grid'>
          <label htmlFor='email'>{bible == 'NVI' ? 'Correo Electrónico' : 'Email'}:</label>
          <div className='col-12 md-10'>
            <InputText
              type='text'
              name='email'
              value={signup.email}
              onChange={handleSignupChange}
            />
          </div>
        </div>
        <div className='d-flex align-items-center justify-content-end'>
          <Button
            label={bible == 'NVI' ? 'Cancelar' : 'Cancel'}
            icon='pi pi-times'
            onClick={() => setSignupDialog(false)}
            className='button-text ml-4'
          />
          &nbsp;
          <Button
            label={bible == 'NVI' ? 'Enviar' : 'Send'}
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

  const topicTags = []
  /*
  await axiosClient
    .get('/topicTags')
    .then(response => response.data)
  */

  const topicNames = await axiosClient
    .get('/topicNames')
    .then(response => response.data)

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
      front
    }
  }
}

export default Index

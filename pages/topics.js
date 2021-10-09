import React, { useEffect, useState, lazy, Suspense, useRef } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { axiosClient } from '../axiosClient'
import { getSnapshot } from 'mobx-state-tree'
import { initializeStore } from '../store'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import ContentBlock from '../components/ContentBlock'
import { Dropdown } from 'primereact/dropdown'
import { Toolbar } from 'primereact/toolbar'
import { Fieldset } from 'primereact/fieldset'
import { Chips } from 'primereact/chips'
import { Toast } from 'primereact/toast'
import { confirmPopup } from 'primereact/confirmpopup'
import uuid from 'react-uuid'
import { bibles } from '../bibles'
const grid = 8
import TopBar from '../components/AdminTopBar'
import cookie from 'js-cookie'
import styled from 'styled-components'

const categories = [
  { label: 'Topical Bible', value: 'topics' },
  { label: 'Fresh Start', value: 'start' },
  { label: 'Frequently Asked', value: 'faqs' },
  { label: 'User Submitted', value: 'user' }
]

const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
  background: #fff;
  padding: 2 2 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
`

const Item = styled.div`
  user-select: none;
  min-width: 100px;
  max-width: 100px;
  min-height: 40px;
  max-height: 40px;
  text-align: center;
  vertical-align: top;
  padding: 0px;
  margin: 0px;
  border: 1px solid black;
  border-radius: 3px;
`

const Clone = styled(Item)`
  ~ div {
    transform: none !important;
  }
`

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source.items)
  const destClone = Array.from(destination.items)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}

  result[droppableSource.droppableId] = {
    version: source.version,
    name: source.name,
    tags: source.tags,
    items: sourceClone
  }

  result[droppableDestination.droppableId] = {
    version: destination.version,
    name: destination.name,
    tags: destination.tags,
    items: destClone
  }

  return result
}

const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source.items)
  const destClone = Array.from(destination.items)
  const item = sourceClone[droppableSource.index]

  destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() })

  const result = {}

  result[droppableDestination.droppableId] = {
    version: destination.version,
    name: destination.name,
    tags: destination.tags,
    items: destClone
  }

  return result
}

const copymove = (
  source,
  destination,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source.items)
  const destClone = Array.from(destination.items)
  const clone = JSON.parse(JSON.stringify(sourceClone[droppableSource.index]))
  clone.id = uuid()
  destClone.splice(droppableDestination.index, 0, clone)

  const result = {}

  result[droppableSource.droppableId] = {
    version: source.version,
    name: source.name,
    tags: source.tags,
    items: sourceClone
  }

  result[droppableDestination.droppableId] = {
    version: destination.version,
    name: destination.name,
    tags: destination.tags,
    items: destClone
  }

  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid
})

const TopicComposer = props => {
  const [selectedCategory, setSelectedCategory] = useState('topics')
  const [sectionEditDialog, setSectionEditDialog] = useState(false)
  const [sectionEditIndex, setSectionEditIndex] = useState(-1)
  const [sectionEditVersion, setSectionEditVersion] = useState('')
  const [contentConfig, setContentConfig] = useState({})
  const [contentConfigDialog, setContentConfigDialog] = useState(false)
  const [topicTitles, setTopicTitles] = useState([])
  const [topicTitlesFiltered, setTopicTitlesFiltered] = useState([])
  const [bible, setBible] = useState({})
  const [selectedTopic, setSelectedTopic] = useState({})
  const [currentTopic, setCurrentTopic] = useState({
    title: '',
    active: true
  })
  const [sections, setSections] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [refresh, setRefresh] = useState(uuid())
  const [token, setToken] = useState(cookie.get('token'))
  const toast = useRef(null)

  useEffect(() => {
    if (currentTopic.title && Array.isArray(sections) && sections.length > 0) {
      if (isLoaded) {
        saveCurrent()
        setRefresh(uuid())
      }
    }
  }, [currentTopic.title, sections])

  useEffect(() => {
    const token = cookie.get('token')
    if (token && token.length > 0) {
      if (props.topicTitle) {
        setSelectedTopic(props.topicTitle)
        getTopic(props.topicTitle._id)
      }
    } else {
      Router.push('/admin')
    }
    setTopicTitles(props.store.topicTitles)
  }, [])

  const updateTopicTitles = async () => {
    const newTopicTitles = await axiosClient
      .get('/topicTitles')
      .then(response => response.data)

    if (JSON.stringify(topicTitles) !== JSON.stringify(newTopicTitles)) {
      setTopicTitles(newTopicTitles)
    }
  }

  const onChangeBible = e => {
    setBible(e.value)
  }

  const onChangeCategory = async e => {
    await setSelectedCategory(e.value)
    const filtered = topicTitles.filter(tt => tt.category === e.value)
    setTopicTitlesFiltered(filtered)
  }

  useEffect(() => {
    setSelectedTopic({})
    setCurrentTopic({})
    setSections([])
    const filtered = topicTitles.filter(tt => tt.category === selectedCategory)
    setTopicTitlesFiltered(filtered)
    toast.current.show({
      severity: 'success',
      summary: 'Topic Titles Filtered'
    })
  }, [topicTitles])

  const onChangeTopic = e => {
    setSelectedTopic(e.value)
    if (e.value && e.value._id) {
      getTopic(e.value._id)
    } else {
      setIsLoaded(false)
      setCurrentTopic({})
      setSections([])
    }
  }

  const getTopic = async id => {
    setIsLoaded(false)

    const topic = await axiosClient({
      method: 'get',
      url: `/topics/${id}`
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

    setCurrentTopic(topic)
    setSections(topic.sections)
  }

  const deleteTopic = async () => {
    await axiosClient({
      method: 'delete',
      url: `/topics/${selectedTopic._id}`
    })
      .then(async response => {
        toast.current.show({ severity: 'success', summary: 'Topic Deleted' })
        setSelectedTopic({})
        setCurrentTopic({})
        setSections([])
        updateTopicTitles()
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Deleting Topic'
        })
      })
  }

  const accept = () => {
    deleteTopic()
  }

  const reject = () => {}

  const deleteSelectedTopic = () => {
    if (selectedTopic && selectedTopic._id) {
      confirmPopup({
        target: event.currentTarget,
        message: `Do you want to delete '${selectedTopic.title}' ?`,
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
        reject
      })
    } else {
      setSelectedTopic({})
      setCurrentTopic({})
      setSections([])
    }
  }

  const saveCurrent = async () => {
    // Determine the highest order number for the selected category
    const lastPlace = Math.max.apply(
      Math,
      topicTitlesFiltered.map(function (o) {
        return o.order
      })
    )

    const newTopic = {
      ...currentTopic,
      sections,
      category: selectedCategory,
      order: lastPlace + 1
    }

    // If a topic has an id, then patch it, or else post it.
    await axiosClient({
      method: currentTopic._id ? 'patch' : 'post',
      url: '/topics',
      data: newTopic,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async response => {
        if (response.data.insertedId) {
          setCurrentTopic({ ...currentTopic, _id: response.data.insertedId })
        }
        toast.current.show({ severity: 'success', summary: 'Topic Saved' })
        //updateTopicTitles()
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Saving Topic'
        })
      })
  }

  function onDragEnd (result) {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }

    if (destination.droppableId === 'CONTENT_TEMPLATE') {
      return
    }

    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    if (source.droppableId === 'CONTENT_TEMPLATE') {
      const result = copy(CONTENT_TEMPLATE, sections[dInd], source, destination)
      const newSections = [...sections]
      newSections[dInd] = result[dInd]
      setSections(newSections)
    } else {
      if (sInd === dInd) {
        const items = reorder(
          sections[sInd].items,
          source.index,
          destination.index
        )
        const newSections = [...sections]
        newSections[sInd].items = items
        setSections(newSections)
      } else {
        const result = copymove(
          sections[sInd],
          sections[dInd],
          source,
          destination
        )
        const newSections = [...sections]
        newSections[sInd] = result[sInd]
        newSections[dInd] = result[dInd]
        setSections(newSections)

        const itemClone = JSON.parse(
          JSON.stringify(newSections[dInd].items[destination.index])
        )
        if (itemClone.type === 'passage') {
          // Take on the version of the section in which you land
          itemClone.version = newSections[dInd].version
          lookupPassage(dInd, destination.index, itemClone)
        }
      }
    }
  }

  const lookupPassage = async (sectionEditIndex, itemIndex, item) => {
    const url = `/verses/${item.version}/${item.passageId}`
    const response = await axiosClient({
      method: 'get',
      url,
      headers: {
        accept: 'application/json'
      }
    }).then(response => response.data)

    const formatted = formatVerses(response)
    const newItem = JSON.parse(JSON.stringify(item))
    newItem.reference = formatted.reference
    newItem.html = formatted.html

    // Update the item in place whenever you are ready
    const newSections = [...sections]
    newSections[sectionEditIndex].items[itemIndex] = newItem
    setSections(newSections)
  }

  const formatVerses = verses => {
    const _passage = {}

    if (Array.isArray(verses) && verses.length > 0) {
      let _bible = {}
      let _book = {}
      if (bible && bible.books) {
        _bible = bible
        _book = bible.books.find(b => b.id === verses[0].book)
      } else {
        _bible = bibles.find(b => b.abbreviation === bible)
        _book = _bible.books.find(b => b.id === verses[0].book)
      }

      let endRef = ''
      if (verses.length > 1) {
        endRef = `-${verses[verses.length - 1].verse}`
      }

      _passage.version = _bible.abbreviation
      _passage.passageId = `${_book.id}.${verses[0].chapter}.${verses[0].verse}${endRef}`
      _passage.reference = `${_book.name} ${verses[0].chapter}:${verses[0].verse}${endRef}`
      _passage.html = verses
        .map(v => ` <sup>${v.verse}</sup> ${v.text}`)
        .join('')
        .trim()
    }

    return _passage
  }

  return (
    <div style={{ marginTop: 150 }}>
      <Toast ref={toast} position='bottom-right'></Toast>
      <TopBar />
      <Toolbar
        style={{
          position: 'fixed',
          top: 50,
          left: 0,
          width: '100%',
          zIndex: 1000
        }}
        left={
          <>
            <Dropdown
              value={selectedCategory}
              options={categories}
              onChange={onChangeCategory}
              optionLabel='label'
              placeholder='Select Category'
            />
            <Dropdown
              value={selectedTopic}
              options={topicTitlesFiltered}
              onChange={onChangeTopic}
              filter
              showClear
              filterBy='title'
              optionLabel='title'
              placeholder='Select Topic'
            />
            <Button
              label='New Topic'
              className='p-button-outlined p-button-sm p-button-secondary'
              icon='pi pi-book'
              onClick={() => {
                setSelectedTopic({})
                setCurrentTopic({})
                setSections([])
              }}
            />
          </>
        }
        right={
          <>
            <Button
              onClick={deleteSelectedTopic}
              icon='pi pi-times'
              label='Delete'
              className='p-button-danger p-button-outlined'
            ></Button>
          </>
        }
      />
      <DragDropContext
        onDragEnd={onDragEnd}
        isDropDisabled={true}
        key={refresh}
      >
        <div className='p-grid' style={{ marginTop: 70 }}>
          <div className='p-col-7'>
            <Fieldset
              style={{ margin: '10px 0px 10px 40px' }}
              legend='Topic Editor'
            >
              <div className='p-d-flex' style={{ marginBottom: 10 }}>
                <Button
                  label='Add Version'
                  className='p-button-outlined p-button-sm p-button-secondary'
                  icon='pi pi-book'
                  onClick={() => {
                    setSectionEditIndex(-1)
                    setSectionEditVersion('')
                    setSectionEditDialog(true)
                  }}
                />
                <div className='p-ml-auto p-ai-center'>
                  <label htmlFor='topicTitle'>Title&nbsp;</label>
                  <InputText
                    id='topicTitle'
                    value={currentTopic.title || ''}
                    onChange={e => {
                      setCurrentTopic({
                        ...currentTopic,
                        title: e.target.value
                      })
                    }}
                    className={!currentTopic.title ? 'p-invalid' : ''}
                  />
                </div>
              </div>

              {sections.map((el, ind) => (
                <div key={`builder-${ind}`}>
                  <Fieldset
                    toggleable
                    style={{ margin: '0px 0px 10px 0px' }}
                    legend={
                      <div>
                        <h4>{el.version}</h4>
                        <Button
                          label='Edit'
                          className='p-button-outlined p-button-sm p-button-secondary'
                          icon='pi pi-book'
                          onClick={() => {
                            setSectionEditIndex(ind)
                            setSectionEditVersion(el.version)
                            setSectionEditDialog(true)
                          }}
                        />
                        <Button
                          label='Copy'
                          className='p-button-outlined p-button-sm p-button-secondary'
                          icon='pi pi-copy'
                          onClick={() => {
                            const newSections = [...sections]
                            const copySection = JSON.parse(
                              JSON.stringify(sections[ind])
                            )
                            // Do not copy the uuids, make new ones
                            copySection.items.forEach(function (
                              item,
                              itemIndex,
                              section
                            ) {
                              item.id = uuid()
                              section[itemIndex] = item
                            })
                            newSections.splice(ind, 0, copySection)
                            setSections(newSections)
                          }}
                        />
                        <Button
                          label='Delete Version'
                          className='p-button-outlined p-button-sm p-button-secondary'
                          icon='pi pi-minus-circle'
                          onClick={() => {
                            const newSections = [...sections]
                            newSections.splice(ind, 1)
                            setSections(newSections)
                          }}
                        />
                      </div>
                    }
                  >
                    <div className='p-fluid p-formgrid p-grid'>
                      <div className='p-field p-col'>
                        <label htmlFor='topicName' className='p-d-block'>
                          Name
                        </label>
                        <InputText
                          id='topicName'
                          value={el.name}
                          onBlur={e => {
                            setIsLoaded(false)
                            const newSections = [...sections]
                            newSections[ind].name = e.target.value
                            setSections(newSections)
                          }}
                          className={
                            !el.name ? 'p-invalid p-d-block' : 'p-d-block'
                          }
                        />
                      </div>
                      <div className='p-field p-col'>
                        <label htmlFor='topicTags' className='p-d-block'>
                          Tags
                        </label>
                        <Chips
                          id='topicTags'
                          className='p-d-block'
                          value={el.tags}
                          onChange={e => {
                            setIsLoaded(true)
                            const newSections = [...sections]
                            newSections[ind].tags = e.value
                            setSections(newSections)
                          }}
                        />
                      </div>
                    </div>
                    <div className='p-field p-col'>
                      <label htmlFor={`droppable${ind}`} className='p-d-block'>
                        Content
                      </label>
                      <Droppable id={`droppable${ind}`} droppableId={`${ind}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                          >
                            {el.items.map((item, index) => {
                              item.version = el.version
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )}
                                    >
                                      <div>
                                        <ContentBlock
                                          props={item}
                                          mode='display'
                                          updateValue={value => {
                                            const newSections = [...sections]
                                            newSections[ind].items[
                                              index
                                            ].value = value
                                            setSections(newSections)
                                          }}
                                        />
                                        <Button
                                          label='Edit'
                                          className='p-button-outlined p-button-sm p-button-secondary'
                                          icon='pi pi-window-maximize'
                                          onClick={() => {
                                            setContentConfig(
                                              <ContentBlock
                                                props={item}
                                                mode='config'
                                                updateConfig={json => {
                                                  setIsLoaded(true)
                                                  setContentConfigDialog(false)
                                                  if (json) {
                                                    const newSections = [
                                                      ...sections
                                                    ]
                                                    newSections[ind].items[
                                                      index
                                                    ] = json
                                                    setSections(newSections)
                                                  }
                                                }}
                                              />
                                            )
                                            setContentConfigDialog(true)
                                          }}
                                        />
                                        <Button
                                          label='Delete'
                                          className='p-button-outlined p-button-sm p-button-secondary'
                                          icon='pi pi-minus-circle'
                                          onClick={() => {
                                            setIsLoaded(true)
                                            const newSections = [...sections]
                                            newSections[ind].items.splice(
                                              index,
                                              1
                                            )
                                            setSections(newSections)
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button
                        label='Passage'
                        className='p-button-outlined p-button-sm p-button-secondary'
                        icon='pi pi-plus'
                        onClick={() => {
                          const newItem = {
                            id: uuid(),
                            type: 'passage',
                            version: sections[ind].version
                          }
                          const newSections = [...sections]
                          newSections[ind].items.push(newItem)
                          setSections(newSections)
                        }}
                      />
                      <Button
                        label='Html'
                        className='p-button-outlined p-button-sm p-button-secondary'
                        icon='pi pi-plus'
                        onClick={() => {
                          const newItem = {
                            id: uuid(),
                            type: 'html'
                          }
                          const newSections = [...sections]
                          newSections[ind].items.push(newItem)
                          setSections(newSections)
                        }}
                      />
                    </div>
                  </Fieldset>
                  {/*JSON.stringify(el)*/}
                </div>
              ))}
            </Fieldset>
          </div>
          <div className='p-col-4'>
            <Fieldset legend='Preview Pane' style={{ margin: 10 }}>
              {sections.map((el, ind) => (
                <div key={`display-${ind}`}>
                  <Fieldset
                    style={{ margin: '0px 0px 10px 0px' }}
                    legend={el.version}
                  >
                    {el.items.map((item, index) => {
                      return (
                        <ContentBlock
                          props={item}
                          mode='display'
                          readOnly={true}
                        />
                      )
                    })}
                  </Fieldset>
                </div>
              ))}
            </Fieldset>
          </div>
        </div>
      </DragDropContext>
      <Dialog
        blockScroll={true}
        header='Edit Content'
        visible={contentConfigDialog}
        style={{ width: '50vw' }}
        onHide={() => setContentConfigDialog(false)}
      >
        {contentConfig}
      </Dialog>

      <Dialog
        blockScroll={true}
        header='Edit Version'
        visible={sectionEditDialog}
        style={{ width: '50vw' }}
        footer={
          <div>
            <Button
              label='Cancel'
              icon='pi pi-times'
              onClick={() => {
                setSectionEditIndex(-1)
                setSectionEditVersion('')
                setSectionEditDialog(false)
              }}
              className='p-button-text'
            />
            <Button
              label='OK'
              icon='pi pi-check'
              onClick={() => {
                setIsLoaded(true)
                if (sectionEditIndex < 0) {
                  setSections([
                    ...sections,
                    { version: bible, name: '', tags: [], items: [] }
                  ])
                } else {
                  const newSections = [...sections]
                  // If the version for this section is being changed,
                  // then change all passages in this section
                  if (newSections[sectionEditIndex].version !== bible) {
                    const findBible = bibles.find(b => b.abbreviation === bible)
                    newSections[sectionEditIndex].version = bible
                    newSections[sectionEditIndex].items.forEach(function (
                      item,
                      itemIndex,
                      section
                    ) {
                      item.id = uuid()
                      if (item.type === 'passage') {
                        item.version = bible
                      }
                      section[itemIndex] = item
                    })
                    setSections(newSections)
                    // Update the async stuff after the fact
                    newSections[sectionEditIndex].items.forEach(function (
                      item,
                      itemIndex
                    ) {
                      if (item.type === 'passage') {
                        lookupPassage(sectionEditIndex, itemIndex, item)
                      }
                    })
                  }
                }
                setSectionEditIndex(-1)
                setSectionEditVersion('')
                setSectionEditDialog(false)
              }}
              autoFocus
            />
          </div>
        }
        onHide={() => setSectionEditDialog(false)}
      >
        <div className='p-field'>Select a Version</div>
        <Dropdown
          value={bible}
          options={bibles}
          onChange={onChangeBible}
          optionValue='abbreviation'
          optionLabel='name'
          placeholder='Select a Bible Version'
        />
      </Dialog>
    </div>
  )
}

export async function getServerSideProps (context) {
  const topicTitles = await axiosClient
    .get('/topicTitles?showInactive=true')
    .then(response => response.data)

  const store = initializeStore()

  store.setTopicTitles(topicTitles)

  let topicTitle = ''
  if (context && context.query) {
    if (context.query.id) {
      topicTitle = topicTitles.find(tt => tt._id === context.query.id)
    }
  }

  return {
    props: {
      topicTitle,
      store: getSnapshot(store)
    }
  }
}

export default TopicComposer

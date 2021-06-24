import React, { useEffect, useState, lazy, Suspense, useRef } from 'react'
import axios from 'axios'
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
import {
  HeaderWrapper,
  List,
  Kiosk,
  Item,
  Clone,
  Notice
} from './ComposerStyled.js'
const grid = 8

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
    bibleId: source.bibleId,
    version: source.version,
    name: source.name,
    tags: source.tags,
    items: sourceClone
  }

  result[droppableDestination.droppableId] = {
    bibleId: destination.bibleId,
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
    bibleId: destination.bibleId,
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
    bibleId: source.bibleId,
    version: source.version,
    name: source.name,
    tags: source.tags,
    items: sourceClone
  }

  result[droppableDestination.droppableId] = {
    bibleId: destination.bibleId,
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

const Composer = props => {
  const [sectionEditDialog, setSectionEditDialog] = useState(false)
  const [sectionEditIndex, setSectionEditIndex] = useState(-1)
  const [sectionEditVersion, setSectionEditVersion] = useState('')
  const [contentConfig, setContentConfig] = useState({})
  const [contentConfigDialog, setContentConfigDialog] = useState(false)
  const [bible, setBible] = useState({})
  const [selectedTopic, setSelectedTopic] = useState({})
  const [currentTopic, setCurrentTopic] = useState({
    category: 'topics',
    title: '',
    active: true,
    order: 100
  })
  const [sections, setSections] = useState([])

  const toast = useRef(null)

  const CONTENT_TEMPLATE = {
    version: 'CONTENT_TEMPLATE',
    items: [
      {
        id: 'html',
        type: 'html',
        label: 'HTML'
      },
      {
        id: 'passage',
        type: 'passage',
        label: 'Passage',
        apiKey: props.apiKey
      }
    ]
  }

  useEffect(() => {}, [])

  const updateTopicTitles = async () => {
    const topicTitles = await axiosClient
      .get('/topicTitles?category=topics&showInactive=true')
      .then(response => response.data)

    props.store.setTopicTitles(topicTitles)
  }

  const lookupPassage = async (sectionEditIndex, itemIndex, item) => {
    const url = `https://api.scripture.api.bible/v1/bibles/${item.bibleId}/passages/${item.passageId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`
    const response = await axios({
      method: 'get',
      url,
      headers: {
        accept: 'application/json',
        'api-key': item.apiKey
      }
    }).then(response => response.data.data)
    const newItem = JSON.parse(JSON.stringify(item))
    newItem.html = response.content
    newItem.reference = response.reference
    // Update the item in place whenever you are ready
    const newSections = [...sections]
    newSections[sectionEditIndex].items[itemIndex] = newItem
    setSections(newSections)
  }

  const onChangeBible = e => {
    setBible(e.value)
  }

  const onChangeTopic = e => {
    setSelectedTopic(e.value)
  }

  const getTopic = async () => {
    const topic = await axiosClient({
      method: 'get',
      url: `/topics/${selectedTopic._id}`
    })
      .then(response => {
        toast.current.show({ severity: 'success', summary: 'Topic Loaded' })
        return response.data
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Loading Topic',
          detail: error
        })
      })

    setCurrentTopic(topic)
    setSections(topic.sections)
  }

  const deleteTopic = () => {
    axiosClient({
      method: 'delete',
      url: `/topics/${selectedTopic._id}`
    })
      .then(response => {
        toast.current.show({ severity: 'success', summary: 'Topic Deleted' })
        setCurrentTopic({})
        setSections([])
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Deleting Topic',
          detail: error
        })
      })
  }

  const deleteSelectedTopic = () => {
    confirmPopup({
      target: event.currentTarget,
      message: `Do you want to delete '${selectedTopic.title}' ?`,
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      deleteTopic
    })
  }

  const saveCurrent = async () => {
    // If a topic has an id, then patch it, or else post it.
    await axiosClient({
      method: currentTopic._id ? 'patch' : 'post',
      url: '/topics',
      data: { ...currentTopic, sections }
      //headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        toast.current.show({ severity: 'success', summary: 'Topic Saved' })
        setCurrentTopic({})
        setSections([])
        updateTopicTitles()
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Saving Topic',
          detail: error
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
          itemClone.bibleId = newSections[dInd].bibleId
          itemClone.version = newSections[dInd].version
          lookupPassage(dInd, destination.index, itemClone)
        }
      }
    }
  }

  return (
    <div>
      <Toast ref={toast} position='top-right'></Toast>
      <Toolbar
        left={
          <>
            <Dropdown
              value={selectedTopic}
              options={props.store.topicTitles}
              onChange={onChangeTopic}
              filter
              showClear
              filterBy='title'
              optionLabel='title'
              placeholder='Select Topic'
            />
            &nbsp;
            <Button
              label='Open Topic'
              className='p-button-outlined p-button-sm p-button-secondary'
              icon='pi pi-folder-open'
              onClick={() => {
                getTopic()
              }}
            />
            &nbsp;
            <Button
              onClick={deleteTopic}
              icon='pi pi-times'
              label='Delete'
              className='p-button-danger p-button-outlined'
            ></Button>
            &nbsp;
            <Button
              label='Add Section'
              className='p-button-outlined p-button-sm p-button-secondary'
              icon='pi pi-book'
              onClick={() => {
                setSectionEditIndex(-1)
                setSectionEditVersion('')
                setSectionEditDialog(true)
              }}
            />
          </>
        }
        right={
          <Button
            label='Save Changes'
            icon='pi pi-check'
            className='p-button-success'
            onClick={saveCurrent}
          />
        }
      />

      <div>
        <DragDropContext onDragEnd={onDragEnd} isDropDisabled={true}>
          <div className='p-grid'>
            <div className='p-col-1'>
              <Fieldset legend='Available Controls' style={{ margin: 10 }}>
                <Droppable key={99} droppableId={'CONTENT_TEMPLATE'}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                      innerRef={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {CONTENT_TEMPLATE.items.map((template, index) => (
                        <Draggable
                          key={template.id}
                          draggableId={template.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <>
                              <Item
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {template.label}
                              </Item>
                              {snapshot.isDragging ? (
                                <Clone>{template.label}</Clone>
                              ) : (
                                ''
                              )}
                            </>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Fieldset>
            </div>
            <div className='p-col-7'>
              <Fieldset
                style={{ margin: '10px 0px 10px 40px' }}
                legend='Topic Editor'
              >
                <div className='p-d-flex p-jc-end p-ai-center'>
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
                  />
                </div>
                {sections.map((el, ind) => (
                  <div key={`builder-${ind}`}>
                    <Fieldset
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
                            label='Delete Section'
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
                            onChange={e => {
                              const newSections = [...sections]
                              newSections[ind].name = e.target.value
                              setSections(newSections)
                            }}
                            className='p-d-block'
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
                              const newSections = [...sections]
                              newSections[ind].tags = e.value
                              setSections(newSections)
                            }}
                          />
                        </div>
                      </div>
                      <div className='p-field p-col'>
                        <label
                          htmlFor={`droppable${ind}`}
                          className='p-d-block'
                        >
                          Content
                        </label>
                        <Droppable
                          id={`droppable${ind}`}
                          droppableId={`${ind}`}
                        >
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
                                            mode='entry'
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
                                                    setContentConfigDialog(
                                                      false
                                                    )
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
                        return <ContentBlock props={item} mode='display' />
                      })}
                    </Fieldset>
                  </div>
                ))}
              </Fieldset>
            </div>
          </div>
        </DragDropContext>
        {/*JSON.stringify(props.topics)*/}
      </div>
      <Dialog
        header='Edit Content'
        visible={contentConfigDialog}
        style={{ width: '50vw' }}
        onHide={() => setContentConfigDialog(false)}
      >
        {contentConfig}
      </Dialog>

      <Dialog
        header='Edit Section'
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
                    newSections[sectionEditIndex].bibleId = findBible.id
                    newSections[sectionEditIndex].version = bible
                    newSections[sectionEditIndex].items.forEach(function (
                      item,
                      itemIndex,
                      section
                    ) {
                      item.id = uuid()
                      if (item.type === 'passage') {
                        item.version = bible
                        item.bibleId = findBible.id
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
        <div className='p-field'>Select a Version for this Section</div>
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

export async function getServerSideProps () {
  const topicTitles = await axiosClient
    .get('/topicTitles?category=topics&showInactive=true')
    .then(response => response.data)

  const store = initializeStore()

  store.setTopicTitles(topicTitles)

  return {
    props: {
      store: getSnapshot(store),
      apiKey: process.env.ABS_API_KEY
    }
  }
}

export default Composer

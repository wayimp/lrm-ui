import React, { useEffect, useState, lazy, Suspense } from 'react'
import axios from 'axios'
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
  const [state, setState] = useState([])
  const [selectedTopic, setSelectedTopic] = useState({})
  const [bible, setBible] = useState({})

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
    const newState = [...state]
    newState[sectionEditIndex].items[itemIndex] = newItem
    setState(newState)
  }

  const onChangeBible = e => {
    setBible(e.value)
  }

  const handleTopicChange = e => {
    setSelectedTopic(topic)
    setState(topic.sections)
  }

  const saveCurrent = () => {
    const updated = { ...selectedTopic, sections: state }
    dispatch(updateTopic(updated))
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
      const result = copy(CONTENT_TEMPLATE, state[dInd], source, destination)
      const newState = [...state]
      newState[dInd] = result[dInd]
      setState(newState)
    } else {
      if (sInd === dInd) {
        const items = reorder(
          state[sInd].items,
          source.index,
          destination.index
        )
        const newState = [...state]
        newState[sInd].items = items
        setState(newState)
      } else {
        const result = move(state[sInd], state[dInd], source, destination)
        const newState = [...state]
        newState[sInd] = result[sInd]
        newState[dInd] = result[dInd]
        setState(newState)
      }
    }
  }

  return (
    <div>
      <Toolbar
        left={
          <>
            <Dropdown
              value={selectedTopic.value}
              options={props.topics}
              onChange={handleTopicChange}
              filter
              showClear
              filterBy='label'
              optionLabel='label'
              placeholder='Select Topic'
            />
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
            label='Save Current Topic'
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
                {state.map((el, ind) => (
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
                              const newState = [...state]
                              const copySection = JSON.parse(
                                JSON.stringify(state[ind])
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
                              newState.splice(ind, 0, copySection)
                              setState(newState)
                            }}
                          />
                          <Button
                            label='Delete Section'
                            className='p-button-outlined p-button-sm p-button-secondary'
                            icon='pi pi-minus-circle'
                            onClick={() => {
                              const newState = [...state]
                              newState.splice(ind, 1)
                              setState(newState)
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
                              const newState = [...state]
                              newState[ind].name = e.target.value
                              setState(newState)
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
                              const newState = [...state]
                              newState[ind].tags = e.value
                              setState(newState)
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
                                              const newState = [...state]
                                              newState[ind].items[
                                                index
                                              ].value = value
                                              setState(newState)
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
                                                      const newState = [
                                                        ...state
                                                      ]
                                                      newState[ind].items[
                                                        index
                                                      ] = json
                                                      setState(newState)
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
                                              const newState = [...state]
                                              newState[ind].items.splice(
                                                index,
                                                1
                                              )
                                              setState(newState)
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
                {state.map((el, ind) => (
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
                  setState([
                    ...state,
                    { version: bible, name: '', tags: [], items: [] }
                  ])
                } else {
                  const newState = [...state]
                  // If the version for this section is being changed,
                  // then change all passages in this section
                  if (newState[sectionEditIndex].version !== bible) {
                    const findBible = bibles.find(b => b.abbreviation === bible)
                    newState[sectionEditIndex].version = bible
                    newState[sectionEditIndex].items.forEach(function (
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
                    setState(newState)
                    // Update the async stuff after the fact
                    newState[sectionEditIndex].items.forEach(function (
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

export async function getStaticProps () {
  const store = initializeStore()
  //store.setBibles(bibles)
  return {
    props: { static: getSnapshot(store), apiKey: process.env.ABS_API_KEY }
  }
}

export default Composer

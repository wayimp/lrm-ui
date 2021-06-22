import React, { useEffect, useState, lazy, Suspense } from 'react'
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
import uuid from 'react-uuid'
import { HeaderWrapper, List, Kiosk, Item, Clone } from './ComposerStyled.js'
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
    sectionTitle: source.sectionTitle,
    items: sourceClone
  }

  result[droppableDestination.droppableId] = {
    sectionTitle: destination.sectionTitle,
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
    sectionTitle: destination.sectionTitle,
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
  const [sectionEditTitle, setSectionEditTitle] = useState('')
  const [contentConfig, setContentConfig] = useState({})
  const [contentConfigDialog, setContentConfigDialog] = useState(false)
  const [state, setState] = useState([{ items: [] }])
  const [selectedTopic, setSelectedTopic] = useState({})

  const CONTENT_TEMPLATE = {
    sectionTitle: 'CONTENT_TEMPLATE',
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
              {state.map((el, ind) => (
                <div key={`builder-${ind}`}>
                  <Fieldset legend='Topic Editor' style={{ margin: '10px 0px 10px 40px' }}>
                    <Droppable key={ind} droppableId={`${ind}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                          {...provided.droppableProps}
                        >
                          {el.items.map((item, index) => (
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
                                        newState[ind].items[index].value = value
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
                                              setContentConfigDialog(false)
                                              if (json) {
                                                const newState = [...state]
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
                                        newState[ind].items.splice(index, 1)
                                        setState(newState)
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Fieldset>
                </div>
              ))}
            </div>
            <div className='p-col-4'>
              <Fieldset legend='Preview Pane' style={{ margin: 10 }}>
                {state.map((el, ind) => (
                  <div key={`display-${ind}`}>
                    <Fieldset legend={el.sectionTitle}>
                      {el.items.map((item, index) => (
                        <ContentBlock props={item} mode='display' />
                      ))}
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
    </div>
  )
}

export async function getStaticProps () {
  const store = initializeStore()
  return {
    props: { static: getSnapshot(store), apiKey: process.env.ABS_API_KEY }
  }
}

export default Composer

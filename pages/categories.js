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

export const List = styled.div`
  border: 1px ${props => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
  background: #fff;
  padding: 2 2 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
  width: 400px;
`

const Item = styled.div`
  user-select: none;
  min-width: 100px;
  min-height: 40px;
  max-height: 40px;
  text-align: center;
  vertical-align: top;
  padding: 0px;
  margin: 0px;
  border: 1px solid black;
  border-radius: 3px;
`

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
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

const TopicOrder = props => {
  const [topicTitles, setTopicTitles] = useState(props.store.topicTitles)
  const [bible, setBible] = useState({})
  const [token, setToken] = useState(cookie.get('token'))
  const toast = useRef(null)

  useEffect(() => {
    if (token && token.length > 0) {
    } else {
      Router.push('/admin')
    }
  }, [])

  const updateTopicTitles = async () => {
    const topicTitles = await axiosClient
      .get('/topicTitles?category=topics&showInactive=true')
      .then(response => response.data)

    setTopicTitles(topicTitles)
  }

  const onChangeBible = e => {
    setBible(e.value)
  }

  const saveCurrent = async () => {
    // If a topic has an id, then patch it, or else post it.

    const topicOrder = topicTitles.map((tt, index) => ({
      _id: tt._id,
      order: index
    }))

    await axiosClient({
      method: 'patch',
      url: '/topicOrder',
      data: topicOrder,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        toast.current.show({ severity: 'success', summary: 'Order Saved' })
        updateTopicTitles()
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Saving Order',
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

    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    const items = reorder(topicTitles, source.index, destination.index)
    setTopicTitles(items)
  }

  return (
    <div style={{ marginTop: 70, maxWidth: 400 }}>
      <Toast ref={toast} position='top-right'></Toast>
      <TopBar />
      <Button
        label='Save Order'
        icon='pi pi-check'
        className='p-button-success'
        onClick={saveCurrent}
      />
      <h3>Category: Topics</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable id='topics' droppableId='topics'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {topicTitles.map((item, index) => {
                return (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
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
                        <div className='p-d-flex p-ai-center p-text-nowrap p-text-truncate'>
                          <Button
                            className='p-button-rounded p-button-text'
                            icon='pi pi-window-maximize'
                            onClick={() => {
                              window.open(`topics?id=${item._id}`)
                            }}
                          />
                          &nbsp;&nbsp;
                          {item.title}
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
      </DragDropContext>
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

export default TopicOrder

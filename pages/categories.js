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
import { categories } from './static'

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
  const [selectedCategory, setSelectedCategory] = useState('topics')
  const [topicTitles, setTopicTitles] = useState([...props.store.topicTitles])
  const [topicTitlesFiltered, setTopicTitlesFiltered] = useState([])
  const [bible, setBible] = useState({})
  const [token, setToken] = useState(cookie.get('token'))
  const toast = useRef(null)
  const [refresh, setRefresh] = useState(uuid())

  useEffect(() => {
    if (token && token.length > 0) {
      setSelectedCategory('topics')
      filterTopicTitles('topics')
    } else {
      Router.push('/admin')
    }
  }, [])

  const onChangeCategory = e => {
    setSelectedCategory(e.value)
    filterTopicTitles(e.value)
  }

  const filterTopicTitles = category => {
    const cat = category || selectedCategory
    const filtered = topicTitles
      .filter(tt => tt.category === cat)
      .sort((a, b) => (a.order > b.order ? 1 : -1))
    setTopicTitlesFiltered(filtered)
  }

  const saveCurrent = async items => {
    const topicOrder = await items.map((to, index) => ({
      ...to,
      order: index
    }))

    setTopicTitlesFiltered(topicOrder)

    const _topicTitles = await topicTitles.map(tt => {
      const update = topicOrder.find(to => to._id === tt._id)
      if (update) {
        tt.order = update.order
      }
      return tt
    })
    setTopicTitles(_topicTitles)
    setRefresh(uuid())

    const stripped = await topicOrder.map((to, index) => ({
      _id: to._id,
      order: index
    }))

    await axiosClient({
      method: 'patch',
      url: '/topicOrder',
      data: stripped,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        toast.current.show({ severity: 'success', summary: 'Order Saved' })
      })
      .catch(error => {
        toast.current.show({
          severity: 'error',
          summary: 'Error Saving Order'
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

    const items = reorder(topicTitlesFiltered, source.index, destination.index)

    saveCurrent(items)
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
          </>
        }
      />

      <DragDropContext onDragEnd={onDragEnd} key={refresh}>
        <h3>
          Category: {categories.find(c => c.value === selectedCategory).label}
        </h3>
        <Droppable id='categoryOrder' droppableId='categoryOrder'>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {topicTitlesFiltered.map((item, index) => {
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
    .get('/topicTitles?showInactive=true')
    .then(response => response.data)

  const store = initializeStore()

  store.setTopicTitles(topicTitles)

  return {
    props: {
      store: getSnapshot(store)
    }
  }
}

export default TopicOrder

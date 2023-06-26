import React, { useState, useEffect } from 'react'
import { Editor } from 'primereact/editor'
import { Button } from 'primereact/button'
import { categories } from '../../static'
import { Dropdown } from 'primereact/dropdown'
import { axiosClient } from '../../axiosClient'

const FeaturedComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const [topics, setTopics] = useState([])

  const onChangeFeatured = e => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.value = e.value
    setState(newState)
  }

  const getFeatured = async () => {
    const featured = await axiosClient
      .get('/featured')
      .then(response => response.data)

    if (Array.isArray(featured)) {
      setTopics(featured)
    }
  }

  useEffect(() => {
    getFeatured()
  }, [])

  switch (mode) {
    case 'lean':
      return <div>Featured Topics</div>
      break

    case 'display':
      return (
        <div className='flex flex-wrap justify-content-center flex-grow-1'>
          <h3 className='mr-2'>Featured Topics:</h3>
          {topics.map((t, i) => (
            <Button
              size="small"
              key={i}
              className='button-outlined m-2'
              label={t.title}
              onClick={() => {
                window.location = `${typeof window !== 'undefined'
                  ? window.location.protocol +
                  '//' +
                  window.location.host.split(/\//)[0]
                  : ''
                  }?t=${t._id}&v=HCSB`
              }}
            />
          ))}
        </div>
      )
      break

    case 'entry':
      return <div>Featured Topics</div>
      break

    case 'config':
      return (
        <>
          <div>Featured Topics</div>
          <div className='d-flex justify-content-end'>
            <Button
              label='Cancel'
              icon='pi pi-times'
              onClick={() => {
                updateConfig(null)
              }}
              className='button-text ml-4'
            />
            <Button
              label='OK'
              icon='pi pi-check'
              onClick={() => {
                updateConfig(state)
              }}
              autoFocus
            />
          </div>
        </>
      )
      break

    default:
      return <></>
  }
}

export default FeaturedComponent

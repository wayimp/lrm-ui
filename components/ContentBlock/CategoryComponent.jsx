import React, { useState, useEffect } from 'react'
import { Editor } from 'primereact/editor'
import { Button } from 'primereact/button'
import { categories } from '../../static'
import { Dropdown } from 'primereact/dropdown'
import { axiosClient } from '../../axiosClient'

const CategoryComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const [topics, setTopics] = useState([])

  const onChangeCategory = e => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.value = e.value
    setState(newState)
  }

  useEffect(async () => {
    if (state.value) {
      const featured = await axiosClient
        .get('/category/featured')
        .then(response => response.data)

      if (Array.isArray(featured)) {
        setTopics(featured)
      }
    }
  }, [])

  switch (mode) {
    case 'lean':
      return <div>Subcategory : {state.value}</div>
      break

    case 'display':
      return (
        <div>
          {topics.map((t, i) => (
            <Button
              key={i}
              className='p-button-outlined p-m-2'
              label={t.title}
              style={{ color: 'black', background: '#9A9AEB' }}
              onClick={() => {
                window.location = `${
                  typeof window !== 'undefined'
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
      return <div>Subcategory</div>
      break

    case 'config':
      return (
        <>
          <div className='p-field'>
            <Dropdown
              value={state.value}
              options={categories}
              onChange={onChangeCategory}
              optionValue='value'
              optionLabel='label'
              placeholder='Select a Category'
            />
          </div>
          <div className='p-d-flex p-jc-end'>
            <Button
              label='Cancel'
              icon='pi pi-times'
              onClick={() => {
                updateConfig(null)
              }}
              className='p-button-text'
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

export default CategoryComponent

import React, { useState, useEffect } from 'react'
import Plyr from 'plyr-react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import uuid from 'react-uuid'
import { Dropdown } from 'primereact/dropdown'

const providers = [
  { name: 'YouTube', code: 'youtube' },
  { name: 'Vimeo', code: 'vimeo' },
  { name: 'MP4', code: 'video/mp4' },
  { name: 'MP3', code: 'audio/mp3' }
]

const MediaComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))

  const typeName = ['youtube', 'vimeo'].includes(state.provider)
    ? 'provider'
    : 'type'
  const mediaSrc = {
    type: (state.provider || '').startsWith('audio') ? 'audio' : 'video',
    sources: [
      {
        src: state.src || '',
        [typeName]: state.provider
      }
    ]
  }

  const handleSrcChange = e => {
    const newState = { ...state }
    newState.src = e.target.value
    setState(newState)
  }

  const handleWidthChange = e => {
    const newState = { ...state }
    newState.maxWidthOrHeight = e.value
    setState(newState)
  }

  const handleProviderChange = e => {
    const newState = { ...state }
    newState.provider = e.value.code
    setState(newState)
  }

  switch (mode) {
    case 'lean':
      return <div>Media</div>
      break

    case 'display':
      return (
        <div
          key={uuid()}
          style={{
            maxWidth: state.maxWidthOrHeight || 600,
            maxHeight: state.maxWidthOrHeight || 600
          }}
        >
          {state.src ? <Plyr source={mediaSrc} /> : ''}
        </div>
      )
      break

    case 'entry':
      return (
        <div
          key={uuid()}
          style={{
            maxWidth: state.maxWidthOrHeight || 600,
            maxHeight: state.maxWidthOrHeight || 600
          }}
        >
          {state.src ? <Plyr source={mediaSrc} /> : ''}
        </div>
      )
      break

    case 'config':
      return (
        <>
          <div className='p-field p-col'>
            <label htmlFor='src'>Provider:</label>
            <Dropdown
              value={providers.find(p => p.code === state.provider)}
              options={providers}
              onChange={handleProviderChange}
              optionLabel='name'
            />
          </div>
          <div className='p-field p-col'>
            <label htmlFor='src'>Code or URL:</label>
            <InputText
              name='src'
              value={state.src}
              onChange={handleSrcChange}
            />
          </div>
          <div className='p-field p-col'>
            <label htmlFor='maxWidthOrHeight'>Max Width:</label>
            <InputNumber
              name='maxWidthOrHeight'
              value={state.maxWidthOrHeight}
              onChange={handleWidthChange}
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

export default MediaComponent

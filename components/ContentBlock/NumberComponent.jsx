import React, { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'

const NumberComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [value, setValue] = useState(props.value || props.defaultValue)
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))

  const handleValueChange = e => {
    setValue(e.value)
    updateValue(e.value)
  }

  const handleStateChange = e => {
    const newState = JSON.parse(JSON.stringify(state))
    newState[e.target.name] = e.target.value
    setState(newState)
  }

  switch (mode) {
    case 'display':
      return (
        <div className='p-fluid'>
          <label>
            {props.prompt ? `${props.prompt}:` : ''} {props.value}
          </label>
        </div>
      )
      break

    case 'entry':
      return (
        <div className='p-field p-grid'>
          <label htmlFor={props.id}>{props.prompt}</label>
          <div className='p-md-6'>
            <InputNumber
              inputStyle={{ maxWidth: 100 }}
              value={value}
              onChange={handleValueChange}
              showButtons
            />
          </div>
        </div>
      )
      break

    case 'config':
      return (
        <>
          <div className='p-field p-grid'>
            <label htmlFor='prompt'>Label Text</label>
            <div className='p-col-12 p-md-10'>
              <InputText
                type='text'
                name='prompt'
                value={state.prompt}
                onChange={handleStateChange}
              />
            </div>
          </div>
          <div>
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

export default NumberComponent

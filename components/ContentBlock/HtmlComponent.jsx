import React, { useState } from 'react'
import { Editor } from 'primereact/editor'
import { Button } from 'primereact/button'

const HtmlComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))

  const handleHtmlChange = e => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.html = e.htmlValue
    setState(newState)
  }

  switch (mode) {
    case 'lean':
      return <div>Custom HTML</div>
      break

    case 'display':
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: props.html
          }}
        ></div>
      )
      break

    case 'entry':
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: props.html
          }}
        ></div>
      )
      break

    case 'config':
      return (
        <>
          <div className='field'>
            <Editor
              style={{ height: '320px' }}
              id='labelText'
              name='html'
              value={state.html}
              onTextChange={handleHtmlChange}
            />
          </div>
          <div className='d-flex justify-content-end'>
            <Button
              label='Cancel'
              icon='pi pi-times'
              onClick={() => {
                updateConfig(null)
              }}
              className='button-text'
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

export default HtmlComponent

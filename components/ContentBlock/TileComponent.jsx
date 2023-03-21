import React, { useState, useRef } from 'react'
import axios from 'axios'
import VerseSelector from '../VerseSelector'
import TileSelector from '../TileSelector'
import { Button } from 'primereact/button'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Editor } from 'primereact/editor'

const TileComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const toast = useRef(null)

  const setPassage = passage => {
    const newState = { ...state }
    newState.version = passage.version
    newState.passageId = passage.passageId
    newState.reference = passage.reference
    newState.html = passage.html
    setState(newState)
  }

  const handleRefChange = e => {
    const newState = { ...state }
    newState.reference = e.target.value
    setState(newState)
  }

  const handleHtmlChange = e => {
    const newState = { ...state }
    newState.html = e.htmlValue
    setState(newState)
  }

  const openChapter = () => {
    const url = `${
      typeof window !== 'undefined'
        ? window.location.protocol + '//' + window.location.host.split(/\//)[0]
        : ''
    }?r=${props.passageId.substring(0, props.passageId.lastIndexOf('.'))}&v=${
      props.version
    }`
    window.open(url)
  }

  switch (mode) {
    case 'lean':
      return (
        <VerseSelector
          refOnly={true}
          readOnly={true}
          version={props.version}
          passageId={props.passageId}
          reference={props.reference}
          html={props.html}
          setPassage={setPassage}
        />
      )
      break

    case 'display':
      return (
        <VerseSelector
          readOnly={true}
          version={props.version}
          passageId={props.passageId}
          reference={props.reference}
          html={props.html}
          setPassage={setPassage}
        />
      )
      break

    case 'entry':
      return (
        <TileSelector
          version={props.version}
          passageId={props.passageId}
          setPassage={setPassage}
        />
      )
      break

    case 'config':
      return (
        <>
          <VerseSelector
            version={props.version}
            passageId={props.passageId}
            setPassage={setPassage}
          />
          <div className='align-items-center mt-2'>
            <label htmlFor='reference'>Reference:&nbsp;</label>
            <InputText
              id='reference'
              value={state.reference}
              onChange={handleRefChange}
            />
          </div>
          <Editor
            style={{ height: '320px' }}
            id='labelText'
            name='html'
            value={state.html}
            onTextChange={handleHtmlChange}
          />
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

export default TileComponent

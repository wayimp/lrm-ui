import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import VerseSelector from '../VerseSelector'
import { Button } from 'primereact/button'

const PassageComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const [fetched, setFetched] = useState(false)

  const setPassage = passage => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.html = passage.html
    newState.passageId = passage.passageId
    newState.version = passage.version
    newState.reference = passage.reference
    setState(newState)
    setFetched(true)
  }

  const convertToHtml = () => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.html = `<b>${newState.reference}</b><br/><br/>` + newState.html
    newState.type = 'html'
    newState.label = 'HTML'
    updateConfig(newState)
  }

  switch (mode) {
    case 'display':
      return (
        <>
          <h4>
            {props.reference ? `${props.reference} (${props.version})` : ''}
          </h4>
          <div
            dangerouslySetInnerHTML={{
              __html: props.html
            }}
          ></div>
        </>
      )
      break

    case 'entry':
      return (
        <VerseSelector
          apiKey={props.apiKey}
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
            apiKey={props.apiKey}
            version={props.version}
            passage={state}
            setPassage={setPassage}
          />
          <div className='p-d-flex p-jc-end'>
            <Button
              label='Convert to HTML'
              icon='pi pi-replay'
              onClick={convertToHtml}
              className='p-button-text'
            />
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
              disabled={!fetched}
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

export default PassageComponent

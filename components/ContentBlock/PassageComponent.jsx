import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import VerseSelector from '../VerseSelector'
import { Button } from 'primereact/button'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Toast } from 'primereact/toast'

const PassageComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const [fetched, setFetched] = useState(false)

  const setPassage = passage => {
    const newState = JSON.parse(JSON.stringify(state))
    newState.html = passage.content
    newState.passageId = passage.id
    newState.bibleId = passage.bibleId
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
          <h4>{props.reference}</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: props.html
            }}
          ></div>
        </>
      )
      break

    case 'entry':
      const toast = useRef(null)
      const refParts = state.passageId ? state.passageId.split('.') : []
      return (
        <>
          <Toast ref={toast} position='top-right'></Toast>
          <VerseSelector
            apiKey={props.apiKey}
            version={props.version}
            passageId={props.passageId}
            setPassage={setPassage}
          />
          <br />
          <h4>
            {state.passageId ? (
              <>
                {state.reference}&nbsp;&nbsp;
                <CopyToClipboard
                  style={{ cursor: 'copy' }}
                  text={`${
                    typeof window !== 'undefined'
                      ? window.location.href.split('?')[0]
                      : ''
                  }?r=${state.passageId}&v=${props.version}`}
                  onCopy={() =>
                    toast.current.show({
                      severity: 'success',
                      summary: 'Link Copied'
                    })
                  }
                >
                  <i className='pi pi-share-alt'></i>
                </CopyToClipboard>
              </>
            ) : (
              ''
            )}
          </h4>
          <div
            dangerouslySetInnerHTML={{
              __html: props.html
            }}
          ></div>
          {state.html ? (
            <Button
              label='Read Chapter'
              className='p-button-rounded p-button-text'
              icon='pi pi-book'
              onClick={() => {
                window.open(
                  `?r=${refParts[0] + '.' + refParts[1]}&v=${props.version}`
                )
              }}
            />
          ) : (
            ''
          )}
        </>
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

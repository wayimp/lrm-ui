import React, { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { Editor } from 'primereact/editor'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputSwitch } from 'primereact/inputswitch'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import uuid from 'react-uuid'
import { axiosClient } from '../../axiosClient'
import cookie from 'js-cookie'

// maxSizeKB: number
// maxWidthOrHeight: number

const ImageComponent = ({ props, mode, updateConfig }) => {
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const [value, setValue] = useState(props.value || '')
  const [isLoading, setIsLoading] = useState(false)
  const fileUploadRef = useRef(null)
  const [imageHash, setImageHash] = React.useState('')
  const toast = useRef(null)
  const [token, setToken] = useState(cookie.get('token'))

  const handleStateChange = e => {
    const newState = { ...state }
    newState[e.target.name] = e.target.value
    setState(newState)
  }

  const handleWidthChange = e => {
    const newState = { ...state }
    newState.maxWidthOrHeight = e.value
    setState(newState)
  }

  const handleImageUpload = async event => {
    setIsLoading(true)
    const imageFile = event.files[0]
    console.log(`originalFile size ${imageFile.size / 1024} KB`)

    const options = {
      maxSizeMB: state.maxSizeKB * 1024,
      maxWidthOrHeight: state.maxWidthOrHeight
    }

    try {
      const compressedFile = await imageCompression(imageFile, options)
      console.log(`compressedFile size ${compressedFile.size / 1024} KB`) // smaller than maxSizeMB
      await uploadToServer(compressedFile, imageFile.name)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }

    event.options.clear()
  }

  const uploadToServer = async (compressedFile, fileName) => {
    if (token) {
      const formData = new FormData()
      formData.append('file-0', new File([compressedFile], fileName))
      await axiosClient({
        method: 'POST',
        url: 'https://api.gothereforeministries.org/images',
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          const url =
            res && res.data && res.data.result[0] && res.data.result[0].url
              ? res.data.result[0].url
              : ''

          // Digital Ocean needs a second to refresh
          setTimeout(function () {
            setValue(url)
            const update = { ...state, value: url }
            updateConfig(update)
            setState(update)
            setIsLoading(false)
            setImageHash(uuid())
          }, 1000)
        })
        .catch(error => {
          toast.current.show({
            severity: 'error',
            summary: 'Error Uploading Image',
            detail: JSON.stringify(error)
          })
          setIsLoading(false)
        })
    }
  }

  switch (mode) {
    case 'lean':
      return <div>Image</div>
      break

    case 'display':
      return (
        <img
          loading='lazy'
          name='imageDisplay'
          src={props.value}
          style={{
            maxWidth: state.maxWidthOrHeight,
            maxHeight: state.maxWidthOrHeight,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            border: '1px solid grey'
          }}
        />
      )
      break

    case 'entry':
      return (
        <>
          <Toast ref={toast} position='top-right'></Toast>
          {isLoading ? (
            <ProgressSpinner />
          ) : value ? (
            <>
              <img
                loading='lazy'
                name='imageDisplay'
                src={`${value}${imageHash ? '?' + imageHash : ''}`}
                style={{
                  maxWidth: state.maxWidthOrHeight,
                  maxHeight: state.maxWidthOrHeight,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  border: '1px solid grey'
                }}
              />
              <Button
                className='button-rounded button-text ml-4'
                onClick={() => {
                  setValue('')
                  const update = { ...state, value: '' }
                  updateConfig(update)
                  setState(update)
                }}
                icon='pi pi-times'
                tooltip='Remove'
                tooltipOptions={{ position: 'left' }}
              />
            </>
          ) : (
            ''
          )}
          <div className='d-flex'>
            <FileUpload
              mode='basic'
              auto
              name='image'
              accept='image/*'
              customUpload={true}
              uploadHandler={handleImageUpload}
              chooseLabel='Upload Image'
            />
          </div>
        </>
      )
      break

    case 'config':
      return (
        <>
          <Toast ref={toast} position='top-right'></Toast>
          {isLoading ? (
            <ProgressSpinner />
          ) : value ? (
            <>
              <img
                loading='lazy'
                name='imageDisplay'
                src={`${value}${imageHash ? '?' + imageHash : ''}`}
                style={{
                  maxWidth: state.maxWidthOrHeight,
                  maxHeight: state.maxWidthOrHeight,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  border: '1px solid grey'
                }}
              />
              <Button
                className='button-rounded button-text ml-4'
                onClick={() => {
                  setValue('')
                  const update = { ...state, value: '' }
                  updateConfig(update)
                  setState(update)
                }}
                icon='pi pi-times'
                tooltip='Remove'
                tooltipOptions={{ position: 'left' }}
              />
            </>
          ) : (
            ''
          )}
          <div className='d-flex'>
            <FileUpload
              mode='basic'
              auto
              name='image'
              accept='image/*'
              customUpload={true}
              uploadHandler={handleImageUpload}
              chooseLabel='Upload Image'
            />
            <div className='field col'>
              <label htmlFor='maxWidthOrHeight'>Max Width:</label>
              <InputNumber
                name='maxWidthOrHeight'
                value={state.maxWidthOrHeight}
                onChange={handleWidthChange}
              />
            </div>
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

export default ImageComponent

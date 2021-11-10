import React, { useState, useRef } from 'react'
import Router from 'next/router'
import TopBar from '../components/AdminTopBar'
import cookie from 'js-cookie'
import { axiosClient } from '../axiosClient'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

const Login = props => {
  const [authenticating, setAuthenticating] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const token = cookie.get('token')
  const toast = useRef(null)

  const handleSubmit = async () => {
    setAuthenticating(true)
    const body = { username, password }
    await axiosClient
      .post('/token', body)
      .then(response => {
        setAuthenticating(false)
        let accessToken,
          roles = ''
        if (response && response.data) {
          accessToken = response.data.access_token
          roles = response.data.roles
        }
        if (accessToken && accessToken.length > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'User Logon Success'
          })

          cookie.set('username', username)
          cookie.set('token', accessToken)

          Router.push('/topics')
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'User Logon Failure'
          })
          Router.push('/')
        }
      })
      .catch(function (error) {
        toast.current.show({
          severity: 'error',
          summary: 'User Logon Failure'
        })
        Router.push('/')
      })
  }

  return (
    <div>
      <Toast ref={toast} position='bottom-right'></Toast>
      <TopBar />
      <div className='demo-container p-p-4 p-lg-2' style={{ marginTop: 50 }}>
        <div className='card p-d-block p-mx-auto'>
          <div className='p-field p-grid'>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user'></i>
              </span>
              <InputText
                placeholder='Username'
                value={username || ''}
                onChange={e => {
                  setUsername(e.target.value)
                }}
              />
            </div>
          </div>
          <div className='p-field p-grid'>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-lock'></i>
              </span>
              <InputText
                placeholder='Password'
                value={password || ''}
                type='password'
                onChange={e => {
                  setPassword(e.target.value)
                }}
              />
            </div>
          </div>
          <div className='p-field p-grid'>
            <Button label='Submit' icon='pi pi-check' onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

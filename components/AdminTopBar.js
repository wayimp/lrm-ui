import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import cookie from 'js-cookie'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { Tooltip } from 'primereact/tooltip'

export default function AdminTopBar () {
  const router = useRouter()
  let roles

  useEffect(() => {
    roles = cookie.get('roles')
  }, [])

  const reset = () => {
    cookie.remove('token')
    router.push('/')
  }

  const leftContents = (
    <React.Fragment>
      <Button
        label='Categories'
        icon='pi pi-th-large'
        className='p-mr-2'
        onClick={() => router.push('/categories')}
      />
      <Button
        label='Topics'
        icon='pi pi-sitemap'
        className='p-mr-2'
        onClick={() => router.push('/topics')}
      />
    </React.Fragment>
  )

  const rightContents = (
    <React.Fragment>
      <Button
        label='Topics'
        icon='pi pi-chart-bar'
        className='p-mr-2 p-button-secondary'
        onClick={() => router.push('/topicMetrics')}
      />
      <Button
        label='Verses'
        icon='pi pi-chart-bar'
        className='p-mr-2 p-button-secondary'
        onClick={() => router.push('/verseMetrics')}
      />
      <Button
        label='Version'
        icon='pi pi-chart-bar'
        className='p-mr-2 p-button-secondary'
        onClick={() => router.push('/versionMetrics')}
      />
      <Button
        label='Visits'
        icon='pi pi-chart-bar'
        className='p-mr-2 p-button-secondary'
        onClick={() => router.push('/visitMetrics')}
      />
      <Button
        icon='pi pi-sign-out'
        className='p-button-rounded p-button-text'
        onClick={reset}
        tooltip='Sign Out'
        tooltipOptions={{ position: 'left' }}
      />
    </React.Fragment>
  )

  return (
    <div>
      <Toolbar
        style={{
          margin: 0,
          padding: 6.5,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          background: '#25416B'
        }}
        left={leftContents}
        right={rightContents}
      />
    </div>
  )
}

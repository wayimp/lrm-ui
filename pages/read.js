import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { axiosClient } from '../axiosClient'
import { bibles } from '../bibles'
import { AutoComplete } from 'primereact/autocomplete'
import { Fieldset } from 'primereact/fieldset'
import { Toast } from 'primereact/toast'
import ContentBlock from '../components/ContentBlock'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

const Read = props => {
  const toast = useRef(null)
  const [bible, setBible] = useState('')

  useEffect(() => {
    setBible(bibles[0].abbreviation)
  }, [])

  const onChangeBible = e => {
    setBible(e.value)
  }

  return (
    <div>
      <Toast ref={toast} position='bottom-right'></Toast>
      <Dropdown
        value={bible}
        options={bibles}
        onChange={onChangeBible}
        optionValue='abbreviation'
        optionLabel='name'
        placeholder='Select a Bible Version'
      />
      <ContentBlock
        props={{
          type: 'passage',
          version: bible
        }}
        mode='entry'
      />
    </div>
  )
}

export default Read

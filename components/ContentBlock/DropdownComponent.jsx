import React, { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

const DropdownComponent = ({ props, mode, updateValue, updateConfig }) => {
  const [value, setValue] = useState(props.value || props.defaultValue)
  const [state, setState] = useState(JSON.parse(JSON.stringify(props)))
  const [rowEdit, setRowEdit] = useState({})

  const handleValueChange = e => {
    setValue(e.value)
    updateValue(e.value)
  }

  const handleStateChange = (name, value) => {
    const newState = JSON.parse(JSON.stringify(state))
    newState[name] = value
    setState(newState)
  }

  const handleTextChange = e => {
    handleStateChange(e.target.name, e.target.value)
  }

  const onRowEditInit = event => {
    const newRowEdit = {
      ...rowEdit,
      [event.index]: JSON.parse(JSON.stringify(state.options[event.index]))
    }
    setRowEdit(newRowEdit)
  }

  const onRowEditCancel = event => {
    const editOptions = [...state.options]
    if (rowEdit.hasOwnProperty(event.index)) {
      editOptions[event.index] = rowEdit[event.index]
      handleStateChange('options', editOptions)
    }
  }

  const onEditorValueChange = (optionKey, props, value) => {
    const editOptions = [...state.options]
    editOptions[props.rowIndex][props.field] = value
    handleStateChange('options', editOptions)
  }

  const inputTextEditor = (optionKey, props) => {
    return (
      <InputText
        type='text'
        value={props.rowData[props.field]}
        onChange={e => onEditorValueChange(optionKey, props, e.target.value)}
      />
    )
  }

  const fieldEditor = (optionKey, props) => {
    return inputTextEditor(optionKey, props)
  }

  const addRow = rowIndex => {
    const editOptions = [...state.options, { label: '', value: '' }]
    handleStateChange('options', editOptions)
  }

  const removeRow = rowIndex => {
    const editOptions = [...state.options]
    editOptions.splice(rowIndex, 1)
    handleStateChange('options', editOptions)
  }

  const moveRowUp = index => {
    if (index > 0) {
      const editOptions = [...state.options]
      const extracted = editOptions.slice(index, index + 1)
      const remaining = editOptions
        .slice(0, index)
        .concat(editOptions.slice(index + 1))
      const inserted = remaining
        .slice(0, index - 1)
        .concat(extracted)
        .concat(remaining.slice(index - 1))
      handleStateChange('options', inserted)
    }
  }

  const moveRowDown = index => {
    if (index < state.options.length - 1) {
      const editOptions = [...state.options]
      const extracted = editOptions.slice(index, index + 1)
      const remaining = editOptions
        .slice(0, index)
        .concat(editOptions.slice(index + 1))
      const inserted = remaining
        .slice(0, index + 1)
        .concat(extracted)
        .concat(remaining.slice(index + 1))
      handleStateChange('options', inserted)
    }
  }

  const actionTemplate = (rowData, column) => {
    return <></>
  }

  const rowEditorTemplate = (rowData, props) => {
    const rowEditor = props.rowEditor
    if (rowEditor.editing) {
      return (
        <>
          <Button
            icon='pi pi-check'
            className='p-button-outlined p-button-sm p-button-secondary'
            onClick={rowEditor.onSaveClick}
          />
          <Button
            icon='pi pi-times'
            className='p-button-outlined p-button-sm p-button-secondary'
            onClick={rowEditor.onCancelClick}
          />
        </>
      )
    } else {
      // custom init element
      return (
        <>
          <Button
            icon='pi pi-arrow-up'
            className='p-button-outlined p-button-sm p-button-secondary'
            onClick={() => moveRowUp(props.rowIndex)}
          />
          <Button
            icon='pi pi-pencil'
            className='p-button-outlined p-button-sm p-button-secondary'
            onClick={rowEditor.onInitClick}
          />
          <Button
            className='p-button-outlined p-button-sm p-button-secondary'
            icon='pi pi-arrow-down'
            onClick={() => moveRowDown(props.rowIndex)}
          />
          <Button
            icon='pi pi-trash'
            className='p-button-outlined p-button-sm p-button-warning'
            onClick={() => removeRow(props.rowIndex)}
          />
        </>
      )
    }
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
        <>
          <h5 style={{ margin: 10 }}>{props.prompt}</h5>
          <div className='p-formgroup p-md-12'>
            <Dropdown
              value={value}
              options={props.options}
              onChange={handleValueChange}
              optionLabel='label'
              placeholder={props.placeholder}
            />
          </div>
        </>
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
                onChange={handleTextChange}
              />
            </div>
            <label htmlFor='placeholder'>Placeholder Text</label>
            <div className='p-col-12 p-md-10'>
              <InputText
                type='text'
                name='placeholder'
                value={state.placeholder}
                onChange={handleTextChange}
              />
            </div>
          </div>
          <Button
            label='New Option'
            icon='pi pi-plus'
            className='p-button-outlined p-button-sm p-button-primary'
            onClick={addRow}
          />
          <DataTable
            value={state.options}
            editMode='row'
            dataKey='id'
            onRowEditInit={onRowEditInit}
            onRowEditCancel={onRowEditCancel}
          >
            <Column
              field='label'
              header='Label'
              editor={props => fieldEditor('options', props)}
            ></Column>
            <Column
              field='value'
              header='Value'
              editor={props => fieldEditor('options', props)}
            ></Column>
            <Column
              rowEditor
              headerStyle={{ width: '7rem' }}
              bodyStyle={{ textAlign: 'center' }}
              body={rowEditorTemplate}
            ></Column>
          </DataTable>
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

export default DropdownComponent

import React from 'react'
import HtmlComponent from './HtmlComponent'
import PassageComponent from './PassageComponent'
//import RadioComponent from './RadioComponent'
//import NumberComponent from './NumberComponent'
//import TextComponent from './TextComponent'
//import DropdownComponent from './DropdownComponent'

const ContentBlock = ({ props, mode, updateValue, updateConfig }) => {
  switch (props.type) {
    case 'html':
      return (
        <HtmlComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break

    case 'passage':
      return (
        <PassageComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break
    /*
    case 'radio':
      return (
        <RadioComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break

    case 'number':
      return (
        <NumberComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break

    case 'text':
      return (
        <TextComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break

    case 'dropdown':
      return (
        <DropdownComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break
*/
    default:
      return <></>
  }
}

export default ContentBlock

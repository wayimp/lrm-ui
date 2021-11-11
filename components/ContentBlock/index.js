import React from 'react'
import HtmlComponent from './HtmlComponent'
import PassageComponent from './PassageComponent'
import ImageComponent from './ImageComponent'
import MediaComponent from './MediaComponent'

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

    case 'image':
      return (
        <ImageComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break

    case 'media':
      return (
        <MediaComponent
          props={props}
          mode={mode}
          updateValue={updateValue}
          updateConfig={updateConfig}
        />
      )
      break

    default:
      return <></>
  }
}

export default ContentBlock

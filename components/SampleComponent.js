import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'

const TodoExample = (props) => {
  const [text, setText] = useState('')

  function handleInputChange(e) {
    setText(e.target.value)
  }

  function handleSubmit() {
    if (text) {
      setText('')
      props.store.addTodo(text)
    }
  }

  return (
    <div className="example">
      <h1>React Hooks Todo Example</h1>
      <h2>
        <span className="code">mobx-react-lite</span>
        <span>+</span>
        <span className="code">mobx-state-tree</span>
      </h2>
      <div>
        <input
          type="text"
          onChange={handleInputChange}
          value={text}
          placeholder="todo"
        />
        <button type="submit" onClick={handleSubmit}>
          add
        </button>
      </div>
      <div>
        {props.store.todos.map((todo, idx) => (
          <li key={idx}>{todo.title}</li>
        ))}
      </div>
    </div>
  )
}

export default TodoExample


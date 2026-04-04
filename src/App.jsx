import { useState } from 'react'
import './App.css'
import ToDoCreate from './components/ToDoCreate'
import ToDoList from './components/ToDoList'

function App() {

  const [todos, setTodos] = useState([]);

  const createTodo = (newTodo) => {
    setTodos([...todos, newTodo])
  }

  const removeTodo = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  }

  const updateTodo = (updatedTodo) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id !== updatedTodo.id) {
        return todo;
      }
      return updatedTodo;
    })
    setTodos(updatedTodos);
  }

  console.log(todos);

  return (
    <div>
      <ToDoCreate onCreateTodo={createTodo} />
      <ToDoList todos={todos} onRemoveTodo={removeTodo} onUpdateTodo={updateTodo} />
    </div>
  )
}

export default App

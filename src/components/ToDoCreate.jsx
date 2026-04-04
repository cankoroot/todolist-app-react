import React from 'react'
import '../css/todo.css'
import { useState } from 'react'

function ToDoCreate({ onCreateTodo }) {

    const [newTodo, setNewTodo] = useState('');

    const clearInput = () => {
        setNewTodo('');
    }

    const createTodo = () => {
        if (!newTodo) return (
            alert
        );

        const request = {
            id: Math.floor(Math.random() * 1000),
            content: newTodo,
            isCompleted: false
        }
        onCreateTodo(request);
        clearInput();
    }

    return (
        <div className='todo-create'>
            <a href="https://github.com/cankoroot" target="_blank" className='ac'>
                <h3 className='cankoroot'>cankoroot</h3>
            </a>
            <div className="neon-wrapper">
                <h1 className="hero-title">TO-DO-LIST APP</h1>
            </div>

            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} type="text" placeholder='Todo giriniz.' className='todo-input' />
            <button onClick={createTodo} className='create-button'>
                Todo oluştur.
            </button>

        </div>
    )
}

export default ToDoCreate
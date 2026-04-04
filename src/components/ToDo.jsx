import React from 'react'
import { CgPlayListRemove } from "react-icons/cg";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdEditNote } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import '../css/todos.css'
import { useState } from 'react';

function ToDo({ todo, onRemoveTodo, onUpdateTodo }) {
    const { id, content } = todo;

    const [editable, setEditable] = useState(false);

    const [editedContent, setEditedContent] = useState(content);

    const handleUpdateTodo = () => {
        const request = {
            ...todo,
            content: editedContent
        }
        onUpdateTodo(request);
        setEditable(false);
    }

    const handleToggleComplete = () => {
        const request = {
            ...todo,
            isCompleted: !todo.isCompleted
        }
        onUpdateTodo(request);
    }

    const removeTodo = () => {
        onRemoveTodo(id);
    }
    return (
        <div className='todo-row'>
            <div className={`container ${todo.isCompleted ? 'completed' : ''}`}>
                <div className='text'>
                    {
                        editable ? <input value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className='todo-edit-input' type="text" /> : content
                    }
                </div>
                <div className='icons'>
                    <CgPlayListRemove className='remove' onClick={removeTodo} />
                    {
                        editable ? <FaCheck className='check' onClick={handleUpdateTodo} />

                            : <MdEditNote onClick={() => setEditable(true)} />
                    }
                </div>
            </div>
            {
                todo.isCompleted
                    ? <MdCheckBox className='complete-toggle-outside' onClick={handleToggleComplete} />
                    : <MdCheckBoxOutlineBlank className='complete-toggle-outside' onClick={handleToggleComplete} />
            }
        </div>
    )
}

export default ToDo
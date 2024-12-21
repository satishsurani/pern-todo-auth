import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaCheck, FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const ListTodos = ({ todos, onUpdate, onDelete }) => {
    const [isTodoEdit, SetIsTodoEdit] = useState(false)
    const [currentTodo, SetCurrentTodo] = useState(null)

    const { register, handleSubmit, reset } = useForm()

    const navigate = useNavigate()
    const handleCreateTodo = () => {
        navigate('/create-todos')
    }

    const handleEdit = (todo) => {
        const formateViewDate = new Date(todo.dueDate).toISOString().split('T')[0];
        SetCurrentTodo({ ...todo, dueDate: formateViewDate })
        // SetCurrentTodo(todo)
        SetIsTodoEdit(true)
    }

    const handleUpdate = async (data) => {
        await onUpdate(currentTodo.id, data)
        SetIsTodoEdit(false)
        reset()
    }

    const formateDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date).toLocaleString(undefined, options)
    }

    return (
        <div className='p-6 bg-gray-100 min-h-screen'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-bold '>Your Todos List</h1>
                <button onClick={handleCreateTodo}
                    className='flex items-center px-4 py-2 bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-700 transition'
                ><FaPlus className='mr-3' />Create New Todo</button>
            </div>
            {isTodoEdit && (
                <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
                        <h2 className='text-xl font-bold mb-4'>Update Your Todo</h2>

                        <form onSubmit={handleSubmit(handleUpdate)} className='space-y-6'>
                            <div>
                                <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                                    Title
                                </label>
                                <input
                                    {...register('title')}
                                    type='text'
                                    defaultValue={currentTodo?.title}
                                    placeholder='Enter Todo title'
                                    className={`mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                                    Description
                                </label>
                                <textarea
                                    {...register('description')}
                                    defaultValue={currentTodo?.description}
                                    placeholder='Enter Todo Description'
                                    className={`mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                                    Due Date
                                </label>
                                <input
                                    {...register('dueDate')}
                                    defaultValue={currentTodo?.dueDate}
                                    type='date'
                                    className={`mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                                />
                            </div>
                            <div className='flex gap-2'>
                                <button onClick={() => SetIsTodoEdit(false)} type='submit' className='w-full py-3 px-4 bg-indigo-500 font-semibold rounded-md shadow-md hover:bg-red-600 transition'>
                                    Cancel
                                </button>
                                <button type='submit' className='w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition'>
                                    Update Todo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className='space-y-8'>
                <div>
                    <h2 className='text-xl font-semibold mb-4'>
                        Active Todos
                    </h2>

                    <table className='min-w-full bg-white border border-gray-300 rounded-lg shadow-md'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2 border-b text-left'>Title</th>
                                <th className='px-4 py-2 border-b text-left'>Description</th>
                                <th className='px-4 py-2 border-b text-left'>Due Date</th>
                                <th className='px-4 py-2 border-b text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(todos || [])
                                .filter(todo => !todo.isCompleted)
                                .map(todo => (
                                    <tr key={todo.id} className='hover:bg-gray-100 transition'>
                                        <td className='px-4 py-2 border-b text-left'>{todo.title}</td>
                                        <td className='px-4 py-2 border-b text-left'>{todo.description}</td>
                                        <td className='px-4 py-2 border-b text-left'>{formateDate(todo.dueDate)}</td>
                                        <td className='px-4 py-2 border-b flex space-x-2'>
                                            <FaEdit
                                                className='h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 transition'
                                                onClick={() => handleEdit(todo)}
                                            />
                                            <FaTrashAlt
                                                className='h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition'
                                                onClick={() => onDelete(todo.id)}
                                            />
                                            <FaCheck
                                                className='h-6 w-6 text-green-500 cursor-pointer hover:text-green-600 transition'
                                                onClick={() => onUpdate(todo.id, { isCompleted: true })}
                                            />
                                        </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>

                <div>
                    <h2 className='text-xl font-semibold mb-4'>
                        Completed Todos
                    </h2>

                    <table className='min-w-full bg-white border border-gray-300 rounded-lg shadow-md'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2 border-b text-left'>Title</th>
                                <th className='px-4 py-2 border-b text-left'>Description</th>
                                <th className='px-4 py-2 border-b text-left'>Due Date</th>
                                <th className='px-4 py-2 border-b text-left'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(todos || [])
                                .filter(todo => todo.isCompleted)
                                .map(todo => (
                                    <tr key={todo.id} className='hover:bg-gray-100 transition'>
                                        <td className='px-4 py-2 border-b text-left line-through text-gray-500'>{todo.title}</td>
                                        <td className='px-4 py-2 border-b text-left line-through text-gray-500'>{todo.description}</td>
                                        <td className='px-4 py-2 border-b text-left line-through text-gray-500'>{formateDate(todo.dueDate)}</td>
                                        <td className='px-4 py-2 border-b flex space-x-2'>
                                            <FaTrashAlt
                                                className='h-6 w-6 text-red-500 cursor-pointer hover:text-red-600 transition'
                                                onClick={() => onDelete(todo.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default ListTodos
import React from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import { createTodo, getTodosByUserId } from '../../service/todo.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const CreateTodo = () => {

    const todoSchema = Yup.object().shape(
        {
            title: Yup.string().required('title is required'),
            description: Yup.string().optional(),
            dueDate: Yup.date()
                .required('Due date is required')
                .min(new Date(), 'Due Date can not be past')
        }
    )

    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: yupResolver(todoSchema)
    })

    const navigate = useNavigate()

    const onsubmit = async (data) => {
        try {
            const result = await createTodo(data)
            toast.success('todo created successfully')
            reset()
            navigate('/todos-list')
        } catch (error) {
            console.error(error)
            toast.error('failed to create todo')
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-indigo-400 to-pink-600'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg'>
                <h2 className='text-3xl font-semibold text-center text-gray-900'>Create Your New Todos!</h2>
                <form onSubmit={handleSubmit(onsubmit)} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                            Title
                        </label>
                        <input
                            {...register('title')}
                            type='text'
                            placeholder='Enter Todo title'
                            className={`mt-1 block w-full px-4 py-3 bg-gray-100 border ${errors.title ? "border-red-500" : "border-red-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                        />
                        {errors.title && (
                            <p className='text-red-500 text-sm mt-2 text-left'>{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder='Enter Todo Description'
                            className={`mt-1 block w-full px-4 py-3 bg-gray-100 border ${errors.description ? "border-red-500" : "border-red-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-left p-1 text-gray-700'>
                            Due Date
                        </label>
                        <input
                            {...register('dueDate')}
                            type='date'
                            className={`mt-1 block w-full px-4 py-3 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                        />
                        {errors.dueDate && (
                            <p className='text-red-500 text-sm mt-2 text-left'>{errors.dueDate.message}</p>
                        )}
                    </div>

                    <button type='submit' className='w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-400 to-pink-600 hover:from-indigo-600 hover:via-purple-400 hover:to-pink-600 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                        Create Todo
                    </button>
                </form>

            </div>
        </div>
    )
}

export default CreateTodo
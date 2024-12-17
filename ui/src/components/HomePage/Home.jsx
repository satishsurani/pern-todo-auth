import React from 'react'
import { useSelector } from 'react-redux' // Importing useSelector to access Redux state
import Navbar from './Navbar' // Importing the Navbar component

const Home = () => {
  // Accessing the 'user' from Redux store (auth state)
  const { user } = useSelector(state => state.auth)

  return (
    <div className='w-full'>
      {/* Navbar component, placed at the top of the page */}
      <Navbar />
      
      <div className='flex flex-col lg:flex-row items-center lg:justify-between bg-white py-16 px-8 lg:px-12'>
        {/* Left side: Welcome message and description */}
        <div className='lg:w-1/2 text-center lg:text-left'>
          <h2 className='text-3xl font-semibold text-gray-800 lg:text-4xl'>
            {/* Displaying a welcome message with the user's name if available */}
            Welcome ! <span className='text-indigo-600'>{user?.name}</span>
          </h2>
          <p className='mt-4 text-sm text-gray-500 lg:text-base'>
            {/* Placeholder text (Lorem ipsum) */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo nesciunt libero similique numquam cupiditate velit porro. Libero doloribus explicabo obcaecati saepe laboriosam dolorum sequi, eaque culpa fuga eius. Architecto, recusandae.
          </p>

          {/* Button container for actions */}
          <div className='mt-6 flex justify-center lg:justify-start space-x-4'>
            {/* "Create Todos" button */}
            <button className='px-4 bg-gray-900 text-gray-200 text-xs font-semibold rounded hover:bg-gray-700'>
              Create Todos
            </button>
            {/* "List Todos" button */}
            <button className='px-4 py-2 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400'>
              List Todos
            </button>
          </div>
        </div>

        {/* Right side: Image representing a to-do app */}
        <div className='mt-8 lg:mt-0 lg:w-1/2 flex items-center justify-center'>
          <img
            src="https://media.istockphoto.com/id/1394116286/vector/calendar-with-to-do-checklist-business-task-concept-vector-illustration.jpg?s=612x612&w=0&k=20&c=XBB67J91akfZ-0pxtNXxp-3yOBd7TVTST2kC7DONKXA="
            alt="todo app" // Image representing a to-do app
            className='w-full h-full object-cover rounded-lg' // Image styling
          />
        </div>

      </div>
    </div>
  )
}

export default Home;
import React from 'react'; // Importing React to create a functional component
import { FaSpinner } from 'react-icons/fa'; // Importing the FaSpinner icon from react-icons library

function Loader() {
  return (
    <div className='flex items-center justify-center'>
        <FaSpinner className='animate-spin text-white text-2xl' /> {/* Displaying the spinner icon */}
    </div>
  );
}

export default Loader;
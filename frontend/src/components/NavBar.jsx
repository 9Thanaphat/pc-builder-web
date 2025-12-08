import React from 'react'

const NavBar = ({ isDarkMode, toggleDarkMode }) => {
  return (
	<div className='bg-gray-200 dark:bg-slate-950 h-20 p-5 flex justify-between items-center text-gray-900 dark:text-gray-100'>
        <div><h2>BOSS PCPARTPICKER</h2></div>
        <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
    </div>
  )
}

export default NavBar

import React from 'react'
import { useEffect, useState } from "react";

const CPUFilter = ({setCPUFilter, setSocketFilter}) => {

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSocket, setSelectedSocket] = useState("");


  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    setCPUFilter(value); // ส่งค่ากลับไป parent
  };

  const handleSocketChange = (e) => {
    const value = e.target.value;
    setSelectedSocket(value);
    setSocketFilter(value);
  }

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedSocket("");
    setCPUFilter("");
    setSocketFilter("");
  }

  return (
    <div className='flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700'>
      <div className="flex-1">
        <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
        <select
          id="brand-filter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          value={selectedBrand}
          onChange={handleBrandChange}
        >
          <option value="">All</option>
          <option value="amd">AMD</option>
          <option value="intel">Intel</option>
        </select>
      </div>
      <div className="flex-1">
        <label htmlFor="socket-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Socket</label>
        <select
          id="socket-filter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          value={selectedSocket}
          onChange={handleSocketChange}
        >
          <option value="">All</option>
          <option value="LGA1700">LGA1700</option>
          <option value="AM5">AM5</option>
        </select>
      </div>
      <div className="pt-5">
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default CPUFilter

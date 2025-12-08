import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from '../../config';

const MainBoardFilter = ({ setMainboardFilter, setMainboardSocketFilter }) => {
  const [brands, setBrands] = useState([]);
  const [sockets, setSockets] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSocket, setSelectedSocket] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/mainboard`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const uniqueBrands = [...new Set(data.map(item => item.brand))];
        const uniqueSockets = [...new Set(data.map(item => item.socket))];
        setBrands(uniqueBrands);
        setSockets(uniqueSockets);
      } catch (error) {
        console.error("Failed to fetch mainboard filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    if (setMainboardFilter) {
      setMainboardFilter(value);
    }
  };

  const handleSocketChange = (e) => {
    const value = e.target.value;
    setSelectedSocket(value);
    if (setMainboardSocketFilter) {
      setMainboardSocketFilter(value);
    }
  }

  const clearFilters = () => {
    setSelectedBrand("");
    setSelectedSocket("");
    if (setMainboardFilter) {
      setMainboardFilter("");
    }
    if (setMainboardSocketFilter) {
      setMainboardSocketFilter("");
    }
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
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
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
          {sockets.map(socket => (
            <option key={socket} value={socket}>{socket}</option>
          ))}
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
  );
};

export default MainBoardFilter;

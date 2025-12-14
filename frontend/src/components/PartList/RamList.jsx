import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const RamList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  const [ramFilter, setRamFilter] = useState({
	brand: null,
	type: null,
  });

  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [sortBy, setSortBy] = useState('_id'); // New state for sorting

  // Ref to store image elements for animation
  const imageRefs = useRef({});

  const handleAddClick = (part, partType, imageElement) => {
    const imageRect = imageElement ? imageElement.getBoundingClientRect() : null;
    handleSelectPart(part, partType, imageRect);
  };

  useEffect(() => {

    if (partData.ram) {
      const brands = [...new Set(partData.ram.map(r => r.Brand))];
      const types = [...new Set(partData.ram.map(r => r.Type))];
      setAvailableBrands(brands);
      setAvailableTypes(types);
      return;
    }

    const fetchRamData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/ram`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          ram: data
        }));

        const brands = [...new Set(data.map(r => r.Brand))];
        const types = [...new Set(data.map(r => r.Type))];
        setAvailableBrands(brands);
        setAvailableTypes(types);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          ram: []
        }));
        setAvailableBrands([]);
        setAvailableTypes([]);
      }
      setIsLoading(false);
    };

    fetchRamData();
  }, [partData.ram]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading RAM list...</div>;
  }

  if (!partData.ram || partData.ram.length === 0) {
    return <div className='p-5 text-gray-500'>No RAMs found or database is empty.</div>;
  }

  const filteredRam = partData.ram
    .filter(ram => {
      const matchBrand = ramFilter.brand ? ram.Brand === ramFilter.brand : true;
      const matchType = ramFilter.type ? ram.Type === ramFilter.type : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm = 
          ram.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          ram.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchType && matchSearchTerm;
    })
    .sort((a, b) => {
      if (sortBy === 'Price_THB') {
        return a.Price_THB - b.Price_THB;
      }
      return 0; // Default order
    });

  return (


    <div className='bg-white w-full md:w-3/4 min-h-screen p-5 space-y-2'>

		<div className="flex flex-wrap gap-4 mb-4">

      <select
        className="p-2 border rounded"
        value={ramFilter.brand || ""}
        onChange={(e) =>
          setRamFilter(prev => ({
            ...prev,
            brand: e.target.value || null
          }))
        }
      >
        <option value="">All Brands</option>
        {availableBrands.map(brand => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      <select
        className="p-2 border rounded"
        value={ramFilter.type || ""}
        onChange={(e) =>
          setRamFilter(prev => ({
            ...prev,
            type: e.target.value || null
          }))
        }
      >
        <option value="">All Types</option>
        {availableTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <input // New search input field
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded flex-grow"
      />

      <select
        className="p-2 border rounded"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="_id">Default</option>
        <option value="Price_THB">Price: Low to High</option>
      </select>

    </div>

		<div className='bg-gray-50 grid grid-cols-5 md:grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p className='hidden md:block'>Type</p>
  			<p>Capacity</p>
  			<p className='hidden md:block'>Speed</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredRam.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-5 md:grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Model}
			</div>
			<p className='hidden md:block'>{e.Memory_Type}</p>
			<p>{e.Capacity_GB} GB</p>
			<p className='hidden md:block'>{e.Speed_MHz} MHz</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'ram', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default RamList;

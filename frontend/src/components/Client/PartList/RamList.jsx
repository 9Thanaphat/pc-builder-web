import React, { useEffect, useState } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const RamList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  const [ramFilter, setRamFilter] = useState({
	brand: null,
	type: null,
  })

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

  const filteredRam = partData.ram.filter(ram => {
    const matchBrand = ramFilter.brand ? ram.Brand === ramFilter.brand : true;
    const matchType = ramFilter.type ? ram.Type === ramFilter.type : true;

    return matchBrand && matchType;
  });

  return (


    <div className='bg-white w-3/4 min-h-screen p-5 space-y-2'>

		<div className="flex gap-4 mb-4">

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

    </div>

		<div className='bg-gray-50 grid grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Type</p>
  			<p>Capacity</p>
  			<p>Speed</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredRam.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				<div className='w-20 h-20 bg-white rounded-full'></div>
				{e.Brand} {e.Model}
			</div>
			<p>{e.Memory_Type}</p>
			<p>{e.Capacity_GB} GB</p>
			<p>{e.Speed_MHz} MHz</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleSelectPart(e, 'ram')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default RamList;

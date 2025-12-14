import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const CpuCoolerList = ({ partData, setPartData, handleSelectPart, selectedHardwares }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableSocketSupports, setAvailableSocketSupports] = useState([]);

  const [cpuCoolerFilter, setCpuCoolerFilter] = useState({
	brand: null,
	type: null,
    socketSupport: null,
  });

  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [sortBy, setSortBy] = useState('_id'); // New state for sorting
  const [isCompatEnabled, setIsCompatEnabled] = useState(true); // New state for compatibility filter

  // Ref to store image elements for animation
  const imageRefs = useRef({});

  const handleAddClick = (part, partType, imageElement) => {
    const imageRect = imageElement ? imageElement.getBoundingClientRect() : null;
    handleSelectPart(part, partType, imageRect);
  };

  useEffect(() => {

    if (partData.cpuCooler) {
      const brands = [...new Set(partData.cpuCooler.map(c => c.Brand))];
      const types = [...new Set(partData.cpuCooler.map(c => c.Type))];
      const socketSupports = [...new Set(partData.cpuCooler.flatMap(c => c.Socket_Support))];
      setAvailableBrands(brands);
      setAvailableTypes(types);
      setAvailableSocketSupports(socketSupports);
      return;
    }

    const fetchCpuCoolerData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/cpuCooler`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          cpuCooler: data
        }));

        const brands = [...new Set(data.map(c => c.Brand))];
        const types = [...new Set(data.map(c => c.Type))];
        const socketSupports = [...new Set(data.flatMap(c =>
          c.Socket_Support.flatMap(s => s.split(',').map(t => t.trim()))
        ))];
        setAvailableBrands(brands);
        setAvailableTypes(types);
        setAvailableSocketSupports(socketSupports);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          cpuCooler: []
        }));
        setAvailableBrands([]);
        setAvailableTypes([]);
        setAvailableSocketSupports([]);
      }
      setIsLoading(false);
    };

    fetchCpuCoolerData();
  }, [partData.cpuCooler]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading CPU Cooler list...</div>;
  }

  if (!partData.cpuCooler || partData.cpuCooler.length === 0) {
    return <div className='p-5 text-gray-500'>No CPU Coolers found or database is empty.</div>;
  }

const filteredCpuCooler = partData.cpuCooler
    .filter(c => {
      const { cpu } = selectedHardwares;
      const matchBrand = cpuCoolerFilter.brand ? c.Brand === cpuCoolerFilter.brand : true;
      const matchType = cpuCoolerFilter.type ? c.Type === cpuCoolerFilter.type : true;

      const matchSocketSupport = cpuCoolerFilter.socketSupport
        ? c.Socket_Support.some(s => s.toLowerCase().includes(cpuCoolerFilter.socketSupport.toLowerCase()))
        : true;

      let matchCompat = true;
      if (isCompatEnabled && cpu) {
        const cpuSocketLower = (cpu.Socket || "").toString().toLowerCase();
        matchCompat = c.Socket_Support.some(supportStr => {
           const supports = supportStr.split(',').map(s => s.trim().toLowerCase());
           return supports.some(socketItem =>
             cpuSocketLower.includes(socketItem) || socketItem.includes(cpuSocketLower)
           );
        });
      }

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm =
          c.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          c.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchType && matchSocketSupport && matchSearchTerm && matchCompat;
    })
    .sort((a, b) => {
      if (sortBy === 'Price_THB') {
        return a.Price_THB - b.Price_THB;
      }
      return 0;
    });

  return (
    <div className='bg-white w-full md:w-3/4 min-h-screen p-5 space-y-2'>
		<div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="compat-filter"
          checked={isCompatEnabled}
          onChange={() => setIsCompatEnabled(!isCompatEnabled)}
          className="mr-2"
        />
        <label htmlFor="compat-filter">Compatible</label>
      </div>
            <select
                className="p-2 border rounded"
                value={cpuCoolerFilter.brand || ""}
                onChange={(e) => setCpuCoolerFilter(prev => ({ ...prev, brand: e.target.value || null }))}
            >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={cpuCoolerFilter.type || ""}
                onChange={(e) => setCpuCoolerFilter(prev => ({ ...prev, type: e.target.value || null }))}
            >
                <option value="">All Types</option>
                {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={cpuCoolerFilter.socketSupport || ""}
                onChange={(e) => setCpuCoolerFilter(prev => ({ ...prev, socketSupport: e.target.value || null }))}
            >
                <option value="">All Sockets</option>
                {availableSocketSupports.map(ss => (
                <option key={ss} value={ss}>{ss}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded grow"
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
  			<p>Type</p>
  			<p className='hidden md:block'>Height</p>
  			<p className='hidden md:block'>Radiator Size</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredCpuCooler.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-5 md:grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Model}
			</div>
			<p>{e.Type}</p>
			<p className='hidden md:block'>{e.Height_mm ? `${e.Height_mm} mm` : "N/A"}</p>
			<p className='hidden md:block'>{e.Radiator_Size_mm ? `${e.Radiator_Size_mm} mm` : "N/A"}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'cpuCooler', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default CpuCoolerList;

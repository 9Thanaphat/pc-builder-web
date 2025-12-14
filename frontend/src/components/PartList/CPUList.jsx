import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const CPUList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableSeries, setAvailableSeries] = useState([]);

  const [cpuFilter, setCpuFilter] = useState({
	brand: null,
	series: null,
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

    if (partData.cpu) {
      // If data is already present, extract brands and series
      const brands = [...new Set(partData.cpu.map(c => c.Brand))];
      const series = [...new Set(partData.cpu.map(c => c.Series))];
      setAvailableBrands(brands);
      setAvailableSeries(series);
      return;
    }

    const fetchCPUData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/cpu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          cpu: data
        }));

        // Extract unique brands and series from the fetched data
        const brands = [...new Set(data.map(c => c.Brand))];
        const series = [...new Set(data.map(c => c.Series))];
        setAvailableBrands(brands);
        setAvailableSeries(series);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          cpu: []
        }));
        setAvailableBrands([]);
        setAvailableSeries([]);
      }
      setIsLoading(false);
    };

    fetchCPUData();
  }, [partData.cpu]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading CPU list...</div>;
  }

  if (!partData.cpu || partData.cpu.length === 0) {
    return <div className='p-5 text-gray-500'>No CPUs found or database is empty.</div>;
  }

  const filteredCPU = partData.cpu
    .filter(cpu => {
      const matchBrand = cpuFilter.brand ? cpu.Brand === cpuFilter.brand : true;
      const matchSeries = cpuFilter.series ? cpu.Series === cpuFilter.series : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm = 
        cpu.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
        cpu.Series.toLowerCase().includes(lowerCaseSearchTerm) ||
        cpu.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchSeries && matchSearchTerm;
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
    value={cpuFilter.brand || ""}
    onChange={(e) =>
      setCpuFilter(prev => ({
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
    value={cpuFilter.series || ""}
    onChange={(e) =>
      setCpuFilter(prev => ({
        ...prev,
        series: e.target.value || null
      }))
    }
  >
    <option value="">All Series</option>
    {availableSeries.map(series => (
      <option key={series} value={series}>{series}</option>
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

		<div className='bg-gray-50 grid grid-cols-5 md:grid-cols-9 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p className='hidden md:block'>Cores</p>
  			<p className='hidden md:block'>Threads</p>
  			<p>Clock</p>
  			<p className='hidden md:block'>Socket</p>
  			<p className='hidden md:block'>Integrated Graphics</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredCPU.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-5 md:grid-cols-9 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Series} {e.Model}
			</div>
			<p className='hidden md:block'>{e.Cores}</p>
			<p className='hidden md:block'>{e.Threads}</p>
			<p>{e.Base_Clock}</p>
			<p className='hidden md:block'>{e.Socket}</p>
			<p className='hidden md:block'>{e.Integrated_Graphics}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'cpu', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default CPUList;

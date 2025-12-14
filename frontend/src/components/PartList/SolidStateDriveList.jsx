import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const SolidStateDriveList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCapacities, setAvailableCapacities] = useState([]);
  const [availableFormFactors, setAvailableFormFactors] = useState([]);

  const [ssdFilter, setSsdFilter] = useState({
	brand: null,
	capacity: null,
    formFactor: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('_id');

  const imageRefs = useRef({});

  const handleAddClick = (part, partType, imageElement) => {
    const imageRect = imageElement ? imageElement.getBoundingClientRect() : null;
    handleSelectPart(part, partType, imageRect);
  };

  useEffect(() => {

    if (partData.ssd) {
      const brands = [...new Set(partData.ssd.map(s => s.Brand))];
      const capacities = [...new Set(partData.ssd.map(s => s.Capacity_GB))].sort((a,b) => a-b);
      const formFactors = [...new Set(partData.ssd.map(s => s.Form_Factor))];
      setAvailableBrands(brands);
      setAvailableCapacities(capacities);
      setAvailableFormFactors(formFactors);
      return;
    }

    const fetchSsdData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/ssd`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          ssd: data
        }));

        const brands = [...new Set(data.map(s => s.Brand))];
        const capacities = [...new Set(data.map(s => s.Capacity_GB))].sort((a,b) => a-b);
        const formFactors = [...new Set(data.map(s => s.Form_Factor))];
        setAvailableBrands(brands);
        setAvailableCapacities(capacities);
        setAvailableFormFactors(formFactors);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          ssd: []
        }));
        setAvailableBrands([]);
        setAvailableCapacities([]);
        setAvailableFormFactors([]);
      }
      setIsLoading(false);
    };

    fetchSsdData();
  }, [partData.ssd]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading SSD list...</div>;
  }

  if (!partData.ssd || partData.ssd.length === 0) {
    return <div className='p-5 text-gray-500'>No SSDs found or database is empty.</div>;
  }

  const filteredSsd = partData.ssd
    .filter(ssd => {
      const matchBrand = ssdFilter.brand ? ssd.Brand === ssdFilter.brand : true;
      const matchCapacity = ssdFilter.capacity ? ssd.Capacity_GB == ssdFilter.capacity : true;
      const matchFormFactor = ssdFilter.formFactor ? ssd.Form_Factor === ssdFilter.formFactor : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm =
          ssd.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          ssd.Series.toLowerCase().includes(lowerCaseSearchTerm) ||
          ssd.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchCapacity && matchFormFactor && matchSearchTerm;
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
            <select
                className="p-2 border rounded"
                value={ssdFilter.brand || ""}
                onChange={(e) => setSsdFilter(prev => ({ ...prev, brand: e.target.value || null }))}
            >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={ssdFilter.capacity || ""}
                onChange={(e) => setSsdFilter(prev => ({ ...prev, capacity: e.target.value || null }))}
            >
                <option value="">All Capacities</option>
                {availableCapacities.map(c => (
                <option key={c} value={c}>{c} GB</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={ssdFilter.formFactor || ""}
                onChange={(e) => setSsdFilter(prev => ({ ...prev, formFactor: e.target.value || null }))}
            >
                <option value="">All Form Factors</option>
                {availableFormFactors.map(ff => (
                <option key={ff} value={ff}>{ff}</option>
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

		<div className='bg-gray-50 grid grid-cols-5 md:grid-cols-8 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Capacity</p>
  			<p className='hidden md:block'>Form Factor</p>
  			<p className='hidden md:block'>Read</p>
  			<p className='hidden md:block'>Write</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredSsd.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-5 md:grid-cols-8 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Series} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Series} {e.Model}
			</div>
			<p>{e.Capacity_GB} GB</p>
			<p className='hidden md:block'>{e.Form_Factor}</p>
			<p className='hidden md:block'>{e.Read_Speed_MBs} MB/s</p>
			<p className='hidden md:block'>{e.Write_Speed_MBs} MB/s</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'ssd', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default SolidStateDriveList;

import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const MainboardList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableChipsets, setAvailableChipsets] = useState([]);

  const [mainboardFilter, setMainboardFilter] = useState({
	brand: null,
	chipset: null,
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

    if (partData.mainboard) {
      // If data is already present, extract brands and chipsets
      const brands = [...new Set(partData.mainboard.map(mb => mb.Brand))];
      const chipsets = [...new Set(partData.mainboard.map(mb => mb.Chipset))];
      setAvailableBrands(brands);
      setAvailableChipsets(chipsets);
      return;
    }

    const fetchMainboardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/mainboard`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          mainboard: data
        }));

        // Extract unique brands and chipsets from the fetched data
        const brands = [...new Set(data.map(mb => mb.Brand))];
        const chipsets = [...new Set(data.map(mb => mb.Chipset))];
        setAvailableBrands(brands);
        setAvailableChipsets(chipsets);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          mainboard: []
        }));
        setAvailableBrands([]);
        setAvailableChipsets([]);
      }
      setIsLoading(false);
    };

    fetchMainboardData();
  }, [partData.mainboard]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading Mainboard list...</div>;
  }

  if (!partData.mainboard || partData.mainboard.length === 0) {
    return <div className='p-5 text-gray-500'>No Mainboards found or database is empty.</div>;
  }

  const filteredMainboard = partData.mainboard
    .filter(mainboard => {
      const matchBrand = mainboardFilter.brand ? mainboard.Brand === mainboardFilter.brand : true;
      const matchChipset = mainboardFilter.chipset ? mainboard.Chipset === mainboardFilter.chipset : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm = 
          mainboard.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          mainboard.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchChipset && matchSearchTerm;
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
        value={mainboardFilter.brand || ""}
        onChange={(e) =>
          setMainboardFilter(prev => ({
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
        value={mainboardFilter.chipset || ""}
        onChange={(e) =>
          setMainboardFilter(prev => ({
            ...prev,
            chipset: e.target.value || null
          }))
        }
      >
        <option value="">All Chipsets</option>
        {availableChipsets.map(chipset => (
          <option key={chipset} value={chipset}>{chipset}</option>
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
  			<p className='hidden md:block'>Socket</p>
  			<p>Chipset</p>
  			<p className='hidden md:block'>Memory Type</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredMainboard.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-5 md:grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Model}
			</div>
			<p className='hidden md:block'>{e.Socket}</p>
			<p>{e.Chipset}</p>
			<p className='hidden md:block'>{e.Memory_Type}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'mainboard', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default MainboardList;

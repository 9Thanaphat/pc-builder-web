import React, { useEffect, useState } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const MainboardList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableChipsets, setAvailableChipsets] = useState([]);

  const [mainboardFilter, setMainboardFilter] = useState({
	brand: null,
	chipset: null,
  })

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

  const filteredMainboard = partData.mainboard.filter(mainboard => {
    const matchBrand = mainboardFilter.brand ? mainboard.Brand === mainboardFilter.brand : true;
    const matchChipset = mainboardFilter.chipset ? mainboard.Chipset === mainboardFilter.chipset : true;

    return matchBrand && matchChipset;
  });

  return (


    <div className='bg-white w-3/4 min-h-screen p-5 space-y-2'>

		<div className="flex gap-4 mb-4">

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

    </div>

		<div className='bg-gray-50 grid grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Socket</p>
  			<p>Chipset</p>
  			<p>Memory Type</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredMainboard.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				<div className='w-20 h-20 bg-white rounded-full'></div>
				{e.Brand} {e.Model}
			</div>
			<p>{e.Socket}</p>
			<p>{e.Chipset}</p>
			<p>{e.Memory_Type}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleSelectPart(e, 'mainboard')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default MainboardList;


import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const PowerSupplyList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availablePowerWatts, setAvailablePowerWatts] = useState([]);
  const [availableEfficiencies, setAvailableEfficiencies] = useState([]);

  const [psuFilter, setPsuFilter] = useState({
	brand: null,
	powerWatt: null,
    efficiency: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('_id');

  const imageRefs = useRef({});

  const handleAddClick = (part, partType, imageElement) => {
    const imageRect = imageElement ? imageElement.getBoundingClientRect() : null;
    handleSelectPart(part, partType, imageRect);
  };

  useEffect(() => {

    if (partData.psu) {
      const brands = [...new Set(partData.psu.map(p => p.Brand))];
      const powerWatts = [...new Set(partData.psu.map(p => p.Power_Watt))].sort((a,b) => a-b);
      const efficiencies = [...new Set(partData.psu.map(p => p.Efficiency))];
      setAvailableBrands(brands);
      setAvailablePowerWatts(powerWatts);
      setAvailableEfficiencies(efficiencies);
      return;
    }

    const fetchPsuData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/psu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          psu: data
        }));

        const brands = [...new Set(data.map(p => p.Brand))];
        const powerWatts = [...new Set(data.map(p => p.Power_Watt))].sort((a,b) => a-b);
        const efficiencies = [...new Set(data.map(p => p.Efficiency))];
        setAvailableBrands(brands);
        setAvailablePowerWatts(powerWatts);
        setAvailableEfficiencies(efficiencies);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          psu: []
        }));
        setAvailableBrands([]);
        setAvailablePowerWatts([]);
        setAvailableEfficiencies([]);
      }
      setIsLoading(false);
    };

    fetchPsuData();
  }, [partData.psu]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading Power Supply list...</div>;
  }

  if (!partData.psu || partData.psu.length === 0) {
    return <div className='p-5 text-gray-500'>No Power Supplies found or database is empty.</div>;
  }

  const filteredPsu = partData.psu
    .filter(psu => {
      const matchBrand = psuFilter.brand ? psu.Brand === psuFilter.brand : true;
      const matchPowerWatt = psuFilter.powerWatt ? psu.Power_Watt == psuFilter.powerWatt : true;
      const matchEfficiency = psuFilter.efficiency ? psu.Efficiency === psuFilter.efficiency : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm =
          psu.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          psu.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchPowerWatt && matchEfficiency && matchSearchTerm;
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
                value={psuFilter.brand || ""}
                onChange={(e) => setPsuFilter(prev => ({ ...prev, brand: e.target.value || null }))}
            >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={psuFilter.powerWatt || ""}
                onChange={(e) => setPsuFilter(prev => ({ ...prev, powerWatt: e.target.value || null }))}
            >
                <option value="">All Wattages</option>
                {availablePowerWatts.map(pw => (
                <option key={pw} value={pw}>{pw} W</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={psuFilter.efficiency || ""}
                onChange={(e) => setPsuFilter(prev => ({ ...prev, efficiency: e.target.value || null }))}
            >
                <option value="">All Efficiencies</option>
                {availableEfficiencies.map(eff => (
                <option key={eff} value={eff}>{eff}</option>
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
  			<p>Power</p>
  			<p className='hidden md:block'>Efficiency</p>
  			<p className='hidden md:block'>Modularity</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredPsu.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-5 md:grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Model}
			</div>
			<p>{e.Power_Watt} W</p>
			<p className='hidden md:block'>{e.Efficiency}</p>
			<p className='hidden md:block'>{e.Modularity}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'psu', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default PowerSupplyList;

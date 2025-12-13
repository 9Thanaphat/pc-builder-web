import React, { useEffect, useState } from 'react';

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
  })

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

  const filteredSsd = partData.ssd.filter(ssd => {
    const matchBrand = ssdFilter.brand ? ssd.Brand === ssdFilter.brand : true;
    const matchCapacity = ssdFilter.capacity ? ssd.Capacity_GB == ssdFilter.capacity : true;
    const matchFormFactor = ssdFilter.formFactor ? ssd.Form_Factor === ssdFilter.formFactor : true;
    return matchBrand && matchCapacity && matchFormFactor;
  });

  return (
    <div className='bg-white w-3/4 min-h-screen p-5 space-y-2'>
		<div className="flex gap-4 mb-4">
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
        </div>

		<div className='bg-gray-50 grid grid-cols-8 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Capacity</p>
  			<p>Form Factor</p>
  			<p>Read</p>
  			<p>Write</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredSsd.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-8 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				<div className='w-20 h-20 bg-white rounded-full'></div>
				{e.Brand} {e.Series} {e.Model}
			</div>
			<p>{e.Capacity_GB} GB</p>
			<p>{e.Form_Factor}</p>
			<p>{e.Read_Speed_MBs} MB/s</p>
			<p>{e.Write_Speed_MBs} MB/s</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleSelectPart(e, 'ssd')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default SolidStateDriveList;

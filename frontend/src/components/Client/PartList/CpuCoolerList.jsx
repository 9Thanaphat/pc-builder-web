import React, { useEffect, useState } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const CpuCoolerList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableSocketSupports, setAvailableSocketSupports] = useState([]);

  const [cpuCoolerFilter, setCpuCoolerFilter] = useState({
	brand: null,
	type: null,
    socketSupport: null,
  })

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
        const socketSupports = [...new Set(data.flatMap(c => c.Socket_Support))];
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

  const filteredCpuCooler = partData.cpuCooler.filter(c => {
    const matchBrand = cpuCoolerFilter.brand ? c.Brand === cpuCoolerFilter.brand : true;
    const matchType = cpuCoolerFilter.type ? c.Type === cpuCoolerFilter.type : true;
    const matchSocketSupport = cpuCoolerFilter.socketSupport ? c.Socket_Support.includes(cpuCoolerFilter.socketSupport) : true;
    return matchBrand && matchType && matchSocketSupport;
  });

  return (
    <div className='bg-white w-3/4 min-h-screen p-5 space-y-2'>
		<div className="flex gap-4 mb-4">
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
        </div>

		<div className='bg-gray-50 grid grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Type</p>
  			<p>Height</p>
  			<p>Radiator Size</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredCpuCooler.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				<div className='w-20 h-20 bg-white rounded-full'></div>
				{e.Brand} {e.Model}
			</div>
			<p>{e.Type}</p>
			<p>{e.Height_mm ? `${e.Height_mm} mm` : "N/A"}</p>
			<p>{e.Radiator_Size_mm ? `${e.Radiator_Size_mm} mm` : "N/A"}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleSelectPart(e, 'cpuCooler')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default CpuCoolerList;

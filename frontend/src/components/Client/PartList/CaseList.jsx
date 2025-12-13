import React, { useEffect, useState } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const CaseList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableFormFactorSupports, setAvailableFormFactorSupports] = useState([]);

  const [caseFilter, setCaseFilter] = useState({
	brand: null,
	color: null,
    formFactorSupport: null,
  })

  useEffect(() => {

    if (partData.case) {
      const brands = [...new Set(partData.case.map(c => c.Brand))];
      const colors = [...new Set(partData.case.map(c => c.Color))];
      const formFactorSupports = [...new Set(partData.case.flatMap(c => c.Form_Factor_Support))];
      setAvailableBrands(brands);
      setAvailableColors(colors);
      setAvailableFormFactorSupports(formFactorSupports);
      return;
    }

    const fetchCaseData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/case`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          case: data
        }));

        const brands = [...new Set(data.map(c => c.Brand))];
        const colors = [...new Set(data.map(c => c.Color))];
        const formFactorSupports = [...new Set(data.flatMap(c => c.Form_Factor_Support))];
        setAvailableBrands(brands);
        setAvailableColors(colors);
        setAvailableFormFactorSupports(formFactorSupports);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          case: []
        }));
        setAvailableBrands([]);
        setAvailableColors([]);
        setAvailableFormFactorSupports([]);
      }
      setIsLoading(false);
    };

    fetchCaseData();
  }, [partData.case]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading Case list...</div>;
  }

  if (!partData.case || partData.case.length === 0) {
    return <div className='p-5 text-gray-500'>No Cases found or database is empty.</div>;
  }

  const filteredCase = partData.case.filter(c => {
    const matchBrand = caseFilter.brand ? c.Brand === caseFilter.brand : true;
    const matchColor = caseFilter.color ? c.Color === caseFilter.color : true;
    const matchFormFactorSupport = caseFilter.formFactorSupport ? c.Form_Factor_Support.includes(caseFilter.formFactorSupport) : true;
    return matchBrand && matchColor && matchFormFactorSupport;
  });

  return (
    <div className='bg-white w-3/4 min-h-screen p-5 space-y-2'>
		<div className="flex gap-4 mb-4">
            <select
                className="p-2 border rounded"
                value={caseFilter.brand || ""}
                onChange={(e) => setCaseFilter(prev => ({ ...prev, brand: e.target.value || null }))}
            >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={caseFilter.color || ""}
                onChange={(e) => setCaseFilter(prev => ({ ...prev, color: e.target.value || null }))}
            >
                <option value="">All Colors</option>
                {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
                ))}
            </select>

            <select
                className="p-2 border rounded"
                value={caseFilter.formFactorSupport || ""}
                onChange={(e) => setCaseFilter(prev => ({ ...prev, formFactorSupport: e.target.value || null }))}
            >
                <option value="">All Form Factors</option>
                {availableFormFactorSupports.map(ffs => (
                <option key={ffs} value={ffs}>{ffs}</option>
                ))}
            </select>
        </div>

		<div className='bg-gray-50 grid grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Max GPU Length</p>
  			<p>Max CPU Height</p>
  			<p>Side Panel</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredCase.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				<div className='w-20 h-20 bg-white rounded-full'></div>
				{e.Brand} {e.Model}
			</div>
			<p>{e.Max_GPU_Length_mm} mm</p>
			<p>{e.Max_CPU_Height_mm} mm</p>
			<p>{e.Side_Panel}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleSelectPart(e, 'case')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default CaseList;

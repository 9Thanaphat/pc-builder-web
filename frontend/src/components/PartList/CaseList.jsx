import React, { useEffect, useState, useRef } from 'react';

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

  const filteredCase = partData.case
    .filter(c => {
      const matchBrand = caseFilter.brand ? c.Brand === caseFilter.brand : true;
      const matchColor = caseFilter.color ? c.Color === caseFilter.color : true;
      const matchFormFactorSupport = caseFilter.formFactorSupport ? c.Form_Factor_Support.includes(caseFilter.formFactorSupport) : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm = 
          c.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          c.Model.toLowerCase().includes(lowerCaseSearchTerm);

      return matchBrand && matchColor && matchFormFactorSupport && matchSearchTerm;
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

		<div className='bg-gray-50 grid grid-cols-4 md:grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p className='hidden md:block'>Max GPU Length</p>
  			<p className='hidden md:block'>Max CPU Height</p>
  			<p className='hidden md:block'>Side Panel</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredCase.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-4 md:grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Model}
			</div>
			<p className='hidden md:block'>{e.Max_GPU_Length_mm} mm</p>
			<p className='hidden md:block'>{e.Max_CPU_Height_mm} mm</p>
			<p className='hidden md:block'>{e.Side_Panel}</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'case', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default CaseList;

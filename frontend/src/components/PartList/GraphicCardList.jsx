import React, { useEffect, useState, useRef } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const GraphicCardList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableChipsets, setAvailableChipsets] = useState([]);

  const [graphicCardFilter, setGraphicCardFilter] = useState({
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

    if (partData.graphicCard) {
      // If data is already present, extract brands and chipsets
      const brands = [...new Set(partData.graphicCard.map(gc => gc.Brand))];
      const chipsets = [...new Set(partData.graphicCard.map(gc => gc.Chipset))];
      setAvailableBrands(brands);
      setAvailableChipsets(chipsets);
      return;
    }

    const fetchGraphicCardData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/graphicCard`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartData(prev => ({
          ...prev,
          graphicCard: data
        }));

        // Extract unique brands and chipsets from the fetched data
        const brands = [...new Set(data.map(gc => gc.Brand))];
        const chipsets = [...new Set(data.map(gc => gc.Chipset))];
        setAvailableBrands(brands);
        setAvailableChipsets(chipsets);

      } catch (e) {
        console.error(e.message);
        setPartData(prev => ({
          ...prev,
          graphicCard: []
        }));
        setAvailableBrands([]);
        setAvailableChipsets([]);
      }
      setIsLoading(false);
    };

    fetchGraphicCardData();
  }, [partData.graphicCard]);

  if (isLoading) {
    return <div className='p-5 text-lg'>Loading Graphic Card list...</div>;
  }

  if (!partData.graphicCard || partData.graphicCard.length === 0) {
    return <div className='p-5 text-gray-500'>No Graphic Cards found or database is empty.</div>;
  }

  const filteredGraphicCard = partData.graphicCard
    .filter(graphicCard => {
      const matchBrand = graphicCardFilter.brand ? graphicCard.Brand === graphicCardFilter.brand : true;
      const matchChipset = graphicCardFilter.chipset ? graphicCard.Chipset === graphicCardFilter.chipset : true;

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchSearchTerm =
          graphicCard.Brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          graphicCard.Model.toLowerCase().includes(lowerCaseSearchTerm) ||
          graphicCard.Chipset.toLowerCase().includes(lowerCaseSearchTerm);

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
        value={graphicCardFilter.brand || ""}
        onChange={(e) =>
          setGraphicCardFilter(prev => ({
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
        value={graphicCardFilter.chipset || ""}
        onChange={(e) =>
          setGraphicCardFilter(prev => ({
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

		<div className='bg-gray-50 grid grid-cols-4 md:grid-cols-6 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p className='hidden md:block'>Chipset</p>
  			<p className='hidden md:block'>Memory Size</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredGraphicCard.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-4 md:grid-cols-6 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				{e.ImageUrl && <img ref={el => imageRefs.current[e._id] = el} src={e.ImageUrl} alt={`${e.Brand} ${e.Model}`} className='w-20 h-20 object-cover rounded-full' />}
				{!e.ImageUrl && <div className='w-20 h-20 bg-white rounded-full'></div>}
				{e.Brand} {e.Model}
			</div>
			<p className='hidden md:block'>{e.Chipset}</p>
			<p className='hidden md:block'>{e.Memory.Size_GB} GB</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleAddClick(e, 'graphicCard', imageRefs.current[e._id])} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default GraphicCardList;


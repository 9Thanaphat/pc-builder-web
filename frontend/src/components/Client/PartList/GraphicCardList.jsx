import React, { useEffect, useState } from 'react';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const GraphicCardList = ({ partData, setPartData, handleSelectPart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableChipsets, setAvailableChipsets] = useState([]);

  const [graphicCardFilter, setGraphicCardFilter] = useState({
	brand: null,
	chipset: null,
  })

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

  const filteredGraphicCard = partData.graphicCard.filter(graphicCard => {
    const matchBrand = graphicCardFilter.brand ? graphicCard.Brand === graphicCardFilter.brand : true;
    const matchChipset = graphicCardFilter.chipset ? graphicCard.Chipset === graphicCardFilter.chipset : true;

    return matchBrand && matchChipset;
  });

  return (


    <div className='bg-white w-3/4 min-h-screen p-5 space-y-2'>

		<div className="flex gap-4 mb-4">

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

    </div>

		<div className='bg-gray-50 grid grid-cols-7 gap-2 p-2 font-semibold text-gray-600 shadow-sm rounded-t-lg'>
  			<p className='col-span-2'>Name</p>
  			<p>Chipset</p>
  			<p>Memory Size</p>
  			<p>Price</p>
            <p>Action</p>
		</div>

      {filteredGraphicCard.map((e) => (
        <div
          key={e._id}
          className='bg-white hover:bg-gray-50 w-full p-2 grid grid-cols-7 items-center gap-5 shadow-md'
        >
			<div className='col-span-2 flex items-center gap-5'>
				<div className='w-20 h-20 bg-white rounded-full'></div>
				{e.Brand} {e.Model}
			</div>
			<p>{e.Chipset}</p>
			<p>{e.Memory_Size_GB} GB</p>
			<p>{e.Price_THB}</p>
            <button onClick={() => handleSelectPart(e, 'graphicCard')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Add
            </button>
        </div>
      ))}
    </div>
  );
};

export default GraphicCardList;

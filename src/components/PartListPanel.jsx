import React from 'react'
import PartListPanelTop from './PartListPanelTop'
import { useEffect, useState } from "react";
import CPUCard from './parts/CPUCard';
import MainBoardCard from './parts/MainBoardCard';
import { BASE_API_URL } from '../config'; // Import BASE_API_URL

const PartListPanel = ({selectedPart, setSelectedHardwares, selectedHardwares}) => {
  const [partsData, setPartsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [CPUFilter, setCPUFilter] = useState("");
  const [socketFilter, setSocketFilter] = useState("");
  const [mainboardFilter, setMainboardFilter] = useState("");
  const [mainboardSocketFilter, setMainboardSocketFilter] = useState("");

  useEffect(() => {
    if (!selectedPart) {
      return;
    }

    // If data for this part type is already fetched, don't fetch again
    if (partsData[selectedPart]) {
      return;
    }

    const fetchParts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_API_URL}/${selectedPart}`); // Use BASE_API_URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (selectedPart === 'cpu') {
          data.push({id: 6, brand: "Intel", model: "Core i3-14100F", socket: "LGA1700", tdp: 58, price: 3850, core: 4, thread: 8, img: "/img/cpu/intel_core_i3.png"});
          data.push({id: 7, brand: "AMD", model: "Ryzen 9 7900X", socket: "AM5", tdp: 170, price: 15900, core: 12, thread: 24, img: "/img/cpu/ryzen_9_7000.png"});
        }
        setPartsData(prev => ({
          ...prev,
          [selectedPart]: data
        }));
      } catch (e) {
        setError("Failed to fetch parts: " + e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParts();
  }, [selectedPart, partsData]); // Depend on selectedPart and partsData

  const renderPartCards = () => {
    if (isLoading) {
      return <p className="text-gray-900 dark:text-gray-100">Loading {selectedPart}s...</p>;
    }

    if (error) {
      return <p className="text-red-500 dark:text-red-400">Error: {error}</p>;
    }

    const currentParts = partsData[selectedPart];

    if (!currentParts || currentParts.length === 0) {
      return <p className="text-gray-900 dark:text-gray-100">No {selectedPart}s available.</p>;
    }

    switch (selectedPart) {
      case "cpu": {
        const filteredCPU = currentParts.filter(cpu => {
          const brandMatch = !CPUFilter || cpu.brand.toLowerCase() === CPUFilter;
          const socketMatch = !socketFilter || cpu.socket === socketFilter;
          return brandMatch && socketMatch;
        });
        return filteredCPU.map(cpu => <CPUCard key={cpu.id} cpu={cpu} setSelectedHardwares={setSelectedHardwares} />);
      }
      case "mainboard": {
        const filteredMainboard = currentParts.filter(mainboard => {
          const brandMatch = !mainboardFilter || mainboard.brand === mainboardFilter;
          const socketMatch = !mainboardSocketFilter || mainboard.socket === mainboardSocketFilter;
          return brandMatch && socketMatch;
        });
        return filteredMainboard.map(mainboard => <MainBoardCard key={mainboard.id} mainboard={mainboard} setSelectedHardwares={setSelectedHardwares}/>);
      }
      default:
        return <p>Select a part category to view items.</p>;
    }
  };

  return (
	<div className='bg-slate-100 dark:bg-slate-900 w-4/5 p-5'>
    <div className='p-2'><PartListPanelTop selectedPart={selectedPart}  setCPUFilter={setCPUFilter} setSocketFilter={setSocketFilter} setMainboardFilter={setMainboardFilter} setMainboardSocketFilter={setMainboardSocketFilter}/></div>
    <div className="space-y-3 p-2">
      {renderPartCards()}
    </div>
</div>
  )
}

export default PartListPanel

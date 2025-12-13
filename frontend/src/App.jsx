import { useState } from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import CPUList from './components/PartList/CPUList'
import MainboardList from './components/PartList/MainboardList';
import RamList from './components/PartList/RamList';
import GraphicCardList from './components/PartList/GraphicCardList';
import SolidStateDriveList from './components/PartList/SolidStateDriveList';
import PowerSupplyList from './components/PartList/PowerSupplyList';
import CaseList from './components/PartList/CaseList';
import CpuCoolerList from './components/PartList/CpuCoolerList';

function App() {
    const [partData, setPartData] = useState({
      cpu:null,
      mainboard:null,
      ram:null,
      graphicCard:null,
      ssd:null,
      psu:null,
      case:null,
      cpuCooler:null,
    })
   const [partSelected, setPartSelected] = useState("cpu");
   const [selectedHardwares, setSelectedHardwares] = useState({
    cpu: null,
    mainboard: null,
    ram: null,
    graphicCard: null,
    ssd: null,
    psu: null,
    case: null,
    cpuCooler: null,
  });

  const handleSelectPart = (part, partType) => {
    setSelectedHardwares(prev => ({
      ...prev,
      [partType]: part,
    }));
  };

  const handleRemovePart = (partType) => {
    setSelectedHardwares(prev => ({
      ...prev,
      [partType]: null,
    }));
  };

  return (
    <>
      <div className='bg-white min-h-screen'>
        <Navbar/>
        <div className='p-5 flex pl-25 pr-25'>
            <SideBar
              partData={partData}
              setPartData={setPartData}
              setPartSelected={setPartSelected}
              selectedHardwares={selectedHardwares}
              handleRemovePart={handleRemovePart}
            />
            {partSelected === 'cpu' && <CPUList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'mainboard' && <MainboardList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'ram' && <RamList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'graphicCard' && <GraphicCardList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'ssd' && <SolidStateDriveList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'psu' && <PowerSupplyList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'case' && <CaseList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            {partSelected === 'cpuCooler' && <CpuCoolerList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
        </div>
      </div>
    </>
  )
}

export default App

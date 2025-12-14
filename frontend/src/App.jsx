import { useState, useRef, useCallback } from 'react'
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
import FlyToSidebarAnimation from './components/FlyToSidebarAnimation'; // Import the new animation component
import BuildSummary from './components/BuildSummary';

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

  const [animatingItem, setAnimatingItem] = useState(null);
  const sidebarTargetRefs = useRef({});
  const [view, setView] = useState('part-selection'); // 'part-selection' or 'build-summary'

  const handleSidebarRefsReady = useCallback((refsMap) => {
    sidebarTargetRefs.current = refsMap;
  }, []);

  const handleSelectPart = (part, partType, imageRect = null) => {
    setSelectedHardwares(prev => ({
      ...prev,
      [partType]: part,
    }));

    if (imageRect && part.ImageUrl && sidebarTargetRefs.current[partType]) {
      const targetRect = sidebarTargetRefs.current[partType].getBoundingClientRect();
      setAnimatingItem({
        imageSrc: part.ImageUrl,
        startRect: imageRect,
        endRect: targetRect,
        partType: partType,
      });
    }
  };

  const handleRemovePart = (partType) => {
    setSelectedHardwares(prev => ({
      ...prev,
      [partType]: null,
    }));
  };

  const onAnimationEnd = useCallback(() => {
    setAnimatingItem(null);
  }, []);

  const handleBuildClick = () => {
    setView('build-summary');
  };

  const handleBackToPartSelection = () => {
    setView('part-selection');
  };

  return (
    <>
      <div className='bg-white min-h-screen'>
        <Navbar/>
        <div className='flex flex-col p-5 md:flex-row px-4 md:px-8 lg:px-16'>
          {view === 'part-selection' ? (
            <>
              <SideBar
                partData={partData}
                setPartData={setPartData}
                setPartSelected={setPartSelected}
                selectedHardwares={selectedHardwares}
                handleRemovePart={handleRemovePart}
                setAnimatingItem={setAnimatingItem}
                onSidebarRefsReady={handleSidebarRefsReady}
                onBuildClick={handleBuildClick}
              />
              {partSelected === 'cpu' && <CPUList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'mainboard' && <MainboardList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'ram' && <RamList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'graphicCard' && <GraphicCardList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'ssd' && <SolidStateDriveList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'psu' && <PowerSupplyList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'case' && <CaseList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
              {partSelected === 'cpuCooler' && <CpuCoolerList setPartData={setPartData} partData={partData} handleSelectPart={handleSelectPart} />}
            </>
          ) : (
            <BuildSummary selectedHardwares={selectedHardwares} onBack={handleBackToPartSelection} />
          )}
        </div>
      </div>
      {animatingItem && (
        <FlyToSidebarAnimation
          imageSrc={animatingItem.imageSrc}
          startRect={animatingItem.startRect}
          endRect={animatingItem.endRect}
          onAnimationEnd={onAnimationEnd}
        />
      )}
    </>
  )
}

export default App

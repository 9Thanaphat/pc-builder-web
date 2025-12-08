import './style.css'
import NavBar from './components/NavBar'
import PartSelectorSidebar from './components/PartSelectorSidebar'
import PartListPanel from './components/PartListPanel'

import { useState, useEffect } from 'react'

function App() {

  const [selectedPart, setSelectedPart] = useState("cpu");
  const [selectedHardwares, setSelectedHardwares] = useState({
    cpu: null,
    mainboard: null,
    ram: null
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedHardwares).reduce((total, part) => {
      return total + (part ? part.price : 0);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className='flex flex-col h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'>
        <NavBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
        <div className='flex flex-1 pl-40 pr-40'>
          <PartSelectorSidebar
            setSelectedPart={setSelectedPart}
            selectedHardwares={selectedHardwares}
            setSelectedHardwares={setSelectedHardwares}
            totalPrice={totalPrice}
          />
          <PartListPanel
            selectedPart={selectedPart}
            selectedHardwares={selectedHardwares}
            setSelectedHardwares={setSelectedHardwares}
          />
        </div>
    </div>
  );
}

export default App

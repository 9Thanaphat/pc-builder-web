import React from 'react'
import CPUFilter from './filters/CPUFilter';
import MainBoardFilter from './filters/MainBoardFilter';

const PartListPanelTop = ( {selectedPart, setCPUFilter, setSocketFilter, setMainboardFilter, setMainboardSocketFilter}) => {

  let filterCard;

  switch (selectedPart) {
    case "cpu":
      filterCard = <CPUFilter setCPUFilter={setCPUFilter} setSocketFilter={setSocketFilter}/>
      break;
    case "mainboard":
      filterCard = <MainBoardFilter setMainboardFilter={setMainboardFilter} setMainboardSocketFilter={setMainboardSocketFilter}/>
      break;
    default:
      filterCard =  <p className="text-gray-900 dark:text-gray-100">Please select component</p>
  }


  return (
	<div className='bg-white dark:bg-slate-800 p-5 rounded-sm shadow-md'> {filterCard} </div>
  )
}

export default PartListPanelTop

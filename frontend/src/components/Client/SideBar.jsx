import React from 'react';

const SideBar = ({ setPartSelected, selectedHardwares, handleRemovePart }) => {

  const parts = [
    { id: 'cpu', name: 'CPU' },
    { id: 'mainboard', name: 'Mainboard' },
    { id: 'ram', name: 'Ram' },
    { id: 'graphicCard', name: 'Graphic Card' },
    { id: 'ssd', name: 'Solid State Drive' },
    { id: 'psu', name: 'Power Supply' },
    { id: 'case', name: 'Case' },
    { id: 'cpuCooler', name: 'CPU Cooler' },
  ];

  const totalPrice = Object.values(selectedHardwares)
    .filter(part => part !== null)
    .reduce((total, part) => total + part.Price_THB, 0);

  return (
    <div className='bg-white w-1/4 p-5 flex flex-col gap-y-2'>
      <h2 className="text-xl font-bold mb-4">Your Build</h2>
      {parts.map((part) => {
        const selectedPart = selectedHardwares[part.id];
        return (
          <div key={part.id} className='bg-gray-50 p-2 rounded-lg shadow-sm flex flex-col'>
            <div className='font-bold text-gray-700'>{part.name}</div>
            {selectedPart ? (
              <div className="mt-2 flex items-center gap-4">
                <div className='w-16 h-16 bg-white rounded-full' />
                <div className="flex-grow">
                  <p className="font-semibold">{selectedPart.Brand} {selectedPart.Model}</p>
                  <p className="text-sm text-gray-600">{selectedPart.Price_THB.toLocaleString()} THB</p>
                </div>
                <button
                  onClick={() => handleRemovePart(part.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => setPartSelected(part.id)}
                className="mt-2 p-4 border-2 border-dashed rounded-lg text-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"
              >
                Choose a {part.name}
              </div>
            )}
          </div>
        );
      })}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">Total Price</h3>
        <p className="text-2xl font-semibold text-blue-600">{totalPrice.toLocaleString()} THB</p>
      </div>
    </div>
  );
};

export default SideBar;

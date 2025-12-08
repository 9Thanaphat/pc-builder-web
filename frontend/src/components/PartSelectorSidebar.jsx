import React from 'react'

const PartSelectorSidebar = ({setSelectedPart, setSelectedHardwares, selectedHardwares, totalPrice}) => {
  const parts = [
    { id: "cpu", name: "CPU" },
    { id: "mainboard", name: "Mainboard" },
    { id: "ram", name: "Ram" },
    { id: "graphic_card", name: "Graphic Card" },
    { id: "solid_state_drive", name: "Solid State Drive" },
    { id: "power_supply", name: "Power Supply" },
    { id: "case", name: "Case" },
    { id: "cpu_cooler", name: "CPU Cooler" },
  ];

  const handleDeselect = (e, partId) => {
    e.stopPropagation(); // Prevent the button's onClick from firing
    setSelectedHardwares(prev => ({
      ...prev,
      [partId]: null
    }));
  };

  return (
	<div className='bg-white dark:bg-slate-800 w-1/5 p-5 space-y-3'>
      {parts.map((part) => {
        const selectedHardware = selectedHardwares[part.id];
        const imgSource = selectedHardware?.img || "/img/none_selected.jpg";
        const partDisplayName = selectedHardware
          ? `${selectedHardware.brand} ${selectedHardware.model}`
          : part.name;

        return (
          <button
            key={part.id}
            onClick={() => setSelectedPart(part.id)}
            className='bg-gray-100 hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 w-full h-20 flex items-center gap-3 px-4 rounded-md shadow-sm text-gray-900 dark:text-gray-100'
          >
          <div className="bg-white dark:bg-slate-500 w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
          <img
            id={`part-image-${part.id}`}
            src={imgSource}
            className="w-full h-full object-cover"
          />
          </div>
            <p>{partDisplayName}</p>
            {selectedHardware && (
              <div
                className={"ml-auto text-red-500 dark:text-red-400"}
                onClick={(e) => handleDeselect(e, part.id)}
              >
                X
              </div>
            )}
          </button>
        );
      })}
      <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Total Price:</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(totalPrice)}
        </p>
      </div>
  </div>
  )
}

export default PartSelectorSidebar

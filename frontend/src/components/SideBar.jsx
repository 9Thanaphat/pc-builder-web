import React, { useRef, useEffect } from 'react';

const SideBar = ({ setPartSelected, selectedHardwares, handleRemovePart, setAnimatingItem, onSidebarRefsReady, onBuildClick }) => {
  const partImageRefs = useRef({});

  useEffect(() => {
    if (onSidebarRefsReady) {
      onSidebarRefsReady(partImageRefs.current);
    }
  }, [onSidebarRefsReady, selectedHardwares]);

  const parts = [
    { id: 'cpu', name: 'CPU' },
    { id: 'mainboard', name: 'Mainboard' },
    { id: 'graphicCard', name: 'Graphic Card' },
    { id: 'ram', name: 'Memory' },
    { id: 'ssd', name: 'Solid State Drive' },
    { id: 'psu', name: 'Power Supply' },
    { id: 'case', name: 'Case' },
    { id: 'cpuCooler', name: 'CPU Cooler' },
  ];

  // คำนวณราคารวม
  const totalPrice = Object.values(selectedHardwares)
    .filter(part => part && part.Price_THB)
    .reduce((total, part) => total + part.Price_THB, 0);

// คำนวณราคารวม Shopee (ลด 20% สูงสุด 2,000 ต่อชิ้น)
  const totalShopeePrice = Object.values(selectedHardwares)
    .filter(part => part && part.Price_THB)
    .reduce((total, part) => {
      const discountAmount = part.Price_THB * 0.2;
      const cappedDiscount = Math.min(discountAmount, 2000);
      return total + (part.Price_THB - cappedDiscount);
    }, 0);

  return (
    <div className='bg-white w-full md:w-1/4 p-4 flex flex-col h-fit shadow-sm rounded-lg border border-gray-100 mb-4 md:mb-0 md:mr-4'>
      <div className="flex flex-col">
        {parts.map((part) => {
          const selectedPart = selectedHardwares[part.id];
          const isSelected = !!selectedPart;

          return (
            <div
              key={part.id}
              onClick={() => setPartSelected(part.id)}
              className='group flex items-center justify-between py-4 border-b border-dashed border-gray-200 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors'
            >
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <div
                  ref={el => partImageRefs.current[part.id] = el}
                  className="w-12 h-12 shrink-0 bg-white border border-gray-200 rounded-sm flex items-center justify-center overflow-hidden"
                >
                   {isSelected ? (
                      selectedPart.ImageUrl ? (
                        <img
                          src={selectedPart.ImageUrl}
                          alt={selectedPart.Model}
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <div className="text-[10px] text-gray-400 font-bold">No Pic</div>
                      )
                   ) : (
                      <div className="w-full h-full bg-gray-50 group-hover:bg-gray-100 transition-colors" />
                   )}
                </div>

                <div className="flex flex-col truncate pr-2">
                  {isSelected ? (
                    <>
                      <span className="font-semibold text-gray-800 text-sm truncate">
                        {selectedPart.Brand} {selectedPart.Model}
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedPart.Price_THB.toLocaleString()} THB
                      </span>
                    </>
                  ) : (
                    <span
                        className={`text-base font-medium text-gray-400 group-hover:text-gray-600 transition-colors'}`}
                    >
                      เลือก {part.name}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {isSelected ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePart(part.id);
                    }}
                    className="text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded px-3 py-1 transition-all"
                  >
                    Remove
                  </button>
                ) : (
                  <span className="text-2xl font-light text-gray-300 group-hover:text-orange-500 transition-colors pr-2">
                    +
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-100 flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Price</span>
          <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()} THB</span>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-100 flex justify-between items-center relative z-10">

          <div className="group relative flex items-center gap-1 cursor-help">
            <span className="text-gray-600 font-medium">Total Shopee Price</span>

            (?)

            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg z-20 transition-opacity opacity-0 group-hover:opacity-100">
              <ul className="list-disc pl-3 space-y-1">
                <li>ลด 20% จากราคาเต็ม</li>
                <li>ลดสูงสุดไม่เกิน 2,000 บาท/ชิ้น</li>
              </ul>
              <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          <span className="text-xl font-bold text-orange-500">{totalShopeePrice.toLocaleString()} THB</span>
        </div>

        <div className="mt-6">
          <button
            onClick={onBuildClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all"
          >
            Build
          </button>
        </div>

    </div>
  );
};

export default SideBar;

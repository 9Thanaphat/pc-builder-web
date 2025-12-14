import React from 'react';

const BuildSummary = ({ selectedHardwares, onBack }) => {
  const totalPrice = Object.values(selectedHardwares)
    .filter(part => part && part.Price_THB)
    .reduce((total, part) => total + part.Price_THB, 0);

  const totalShopeePrice = Object.values(selectedHardwares)
    .filter(part => part && part.Price_THB)
    .reduce((total, part) => {
      const discountAmount = part.Price_THB * 0.2;
      const cappedDiscount = Math.min(discountAmount, 2000);
      return total + (part.Price_THB - cappedDiscount);
    }, 0);

  return (
    <div className="bg-white w-full min-h-screen p-5 space-y-4">
      <button
        onClick={onBack}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-4"
      >
        &larr; Back to Part Selection
      </button>
      <h1 className="text-3xl font-bold">Your PC Build</h1>
      <div className="space-y-4">
        {Object.entries(selectedHardwares).map(([partType, part]) => (
          <div key={partType} className="bg-white p-4 shadow-md rounded-lg flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0">
              {part && part.ImageUrl && (
                <img src={part.ImageUrl} alt={part.Model} className="w-full h-full object-contain p-1" />
              )}
            </div>
            <div className="flex-grow">
              <h2 className="font-bold text-lg capitalize">{partType}</h2>
              {part ? (
                <div>
                  <p className="font-semibold">{part.Brand} {part.Model}</p>
                  <p className="text-gray-600">{part.Price_THB.toLocaleString()} THB</p>
                </div>
              ) : (
                <p className="text-gray-500">Not selected</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t-2 border-gray-200">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total Price:</span>
          <span>{totalPrice.toLocaleString()} THB</span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold text-orange-500">
          <span>Total Shopee Price:</span>
          <span>{totalShopeePrice.toLocaleString()} THB</span>
        </div>
      </div>
    </div>
  );
};

export default BuildSummary;

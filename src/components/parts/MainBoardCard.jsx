import React from 'react'

const MainBoardCard = ({ mainboard, setSelectedHardwares }) => {
  const handleAddWithAnimation = (e) => {
    const sourceElement = e.currentTarget.closest('.flex.items-center').querySelector('.part-card-image');
    const targetElement = document.getElementById('part-image-mainboard');

    if (sourceElement && targetElement) {
      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      const clone = sourceElement.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = `${sourceRect.left}px`;
      clone.style.top = `${sourceRect.top}px`;
      clone.style.width = `${sourceRect.width}px`;
      clone.style.height = `${sourceRect.height}px`;
      clone.style.transition = 'all 0.5s ease-in-out';
      clone.style.zIndex = 1000;

      document.body.appendChild(clone);

      requestAnimationFrame(() => {
        clone.style.left = `${targetRect.left}px`;
        clone.style.top = `${targetRect.top}px`;
        clone.style.width = `${targetRect.width}px`;
        clone.style.height = `${targetRect.height}px`;
        clone.style.opacity = 0.5;
      });

      clone.addEventListener('transitionend', () => {
        clone.remove();
        setSelectedHardwares(prev => ({
          ...prev,
          mainboard: mainboard
        }));
      }, { once: true });
    } else {
      setSelectedHardwares(prev => ({
        ...prev,
        mainboard: mainboard
      }));
    }
  };

  return (
      <div
        key={mainboard.id}
        className="bg-white dark:bg-slate-800 p-3 h-25 rounded-md shadow-sm flex items-center gap-4 hover:shadow-md transition"
      >
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded overflow-hidden flex items-center justify-center">
          <img
            src={mainboard.img || "/img/mainboard_default.png"}
            className="w-full h-full object-cover part-card-image"
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {mainboard.brand} {mainboard.model}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mainboard.chipset} • {mainboard.socket} • {mainboard.memory_slot}x RAM • {mainboard.size}
          </p>
        </div>
        <div className="text-right w-28">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            ฿{mainboard.price}
          </p>
        </div>
        <button
          onClick={handleAddWithAnimation}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    )
}

export default MainBoardCard

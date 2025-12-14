import React, { useEffect, useState } from 'react';

const FlyToSidebarAnimation = ({ imageSrc, startRect, endRect, onAnimationEnd }) => {
  const [position, setPosition] = useState(startRect);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!startRect || !endRect) return;

    // Set initial position
    setPosition(startRect);
    setOpacity(1);

    // Animate to end position
    const timer = setTimeout(() => {
      setPosition(endRect);
      setOpacity(0.5); // Optional: fade out slightly during animation
    }, 50); // Small delay to ensure initial position is rendered

    const transitionEndTimer = setTimeout(() => {
      onAnimationEnd(); // Notify parent that animation is complete
    }, 550); // Duration of the CSS transition (500ms) + initial delay

    return () => {
      clearTimeout(timer);
      clearTimeout(transitionEndTimer);
    };
  }, [startRect, endRect, imageSrc, onAnimationEnd]);

  if (!startRect || !endRect) {
    return null; // Don't render if positions aren't fully defined
  }

  return (
    <img
      src={imageSrc}
      alt="animating item"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: startRect.width,
        height: startRect.height,
        opacity: opacity,
        transition: 'all 0.5s ease-in-out', // CSS transition for smooth movement
        zIndex: 9999, // Ensure it's above other elements
        pointerEvents: 'none', // Allow clicking through
        borderRadius: '50%', // Make it round
        objectFit: 'cover', // Cover the area
      }}
    />
  );
};

export default FlyToSidebarAnimation;

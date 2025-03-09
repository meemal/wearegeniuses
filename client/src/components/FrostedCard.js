import React from 'react';

/**
 * FrostedCard Component
 * 
 * A reusable component for creating frosted glass effect cards.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be displayed inside the card
 * @param {string} props.className - Additional CSS classes for the card
 * @param {Object} props.icon - Icon component or element to display (optional)
 * @param {string} props.title - Title of the card (optional)
 * @param {string} props.iconColor - CSS class for the icon background color (optional)
 */
const FrostedCard = ({ children, className = '', icon, title, iconColor = 'bg-gradient-button-orange' }) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
      <div className="relative p-6 flex flex-col items-center text-center">
        {icon && (
          <div className={`rounded-full ${iconColor} w-16 h-16 flex items-center justify-center text-white mb-4`}>
            {icon}
          </div>
        )}
        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default FrostedCard; 
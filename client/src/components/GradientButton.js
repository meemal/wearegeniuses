import React from 'react';
import { Link } from 'react-router-dom';

/**
 * GradientButton Component
 * 
 * A button component with gradient background styling.
 * Can be rendered as a button element or as a Link component from react-router-dom.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be displayed inside the button
 * @param {string} props.to - If provided, renders as a Link to this path
 * @param {function} props.onClick - Click handler (for button variant)
 * @param {string} props.variant - 'orange' or 'pink' for different gradient styles
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.arrow - Whether to display an arrow icon
 */
const GradientButton = ({ 
  children, 
  to, 
  onClick, 
  variant = 'orange',
  className = '',
  arrow = false,
  ...rest 
}) => {
  // Determine the gradient class based on the variant
  const gradientClass = variant === 'pink' 
    ? 'bg-gradient-button-pink' 
    : 'bg-gradient-button-orange';
  
  // Common classes for both button and link
  const commonClasses = `inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-medium 
    transition-transform duration-300 transform hover:scale-105 ${gradientClass} ${className}`;
  
  // Arrow icon
  const arrowIcon = arrow && (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  // Render as Link if 'to' prop is provided, otherwise as a button
  if (to) {
    return (
      <Link to={to} className={commonClasses} {...rest}>
        {children}
        {arrowIcon}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={commonClasses} {...rest}>
      {children}
      {arrowIcon}
    </button>
  );
};

export default GradientButton; 
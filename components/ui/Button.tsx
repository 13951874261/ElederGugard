import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "py-3 px-6 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md tracking-wide";
  
  const variants = {
    // Primary: Elegant Gold/Amber gradient
    primary: "bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:from-amber-600 hover:to-amber-800 shadow-amber-900/10",
    // Secondary: White with Gold Border
    secondary: "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-500 hover:text-amber-700",
    // Danger: Red gradient
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-red-900/20",
    // Ghost: Subtle text
    ghost: "bg-transparent text-stone-500 hover:text-amber-700 shadow-none px-4"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
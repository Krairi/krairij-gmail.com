import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'success';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  href,
  ...props 
}) => {
  const baseStyle = "font-display font-bold border-2 border-givd-dark transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-givd-blue text-white shadow-neo hover:bg-blue-600",
    secondary: "bg-white text-givd-dark shadow-neo hover:bg-gray-100",
    alert: "bg-givd-orange text-givd-dark shadow-neo hover:bg-orange-400",
    success: "bg-givd-green text-givd-dark shadow-neo hover:bg-green-400"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const classes = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};
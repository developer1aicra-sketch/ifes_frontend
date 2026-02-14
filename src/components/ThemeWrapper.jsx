import { useThemeClasses } from '../hooks/useThemeClasses';

/**
 * ThemeWrapper component - Provides theme-aware styling context
 * Wrap components that need theme colors to automatically apply them
 */
export const ThemeWrapper = ({ children, className = '' }) => {
  const theme = useThemeClasses();
  
  return (
    <div className={className} data-theme={theme.themeName}>
      {children}
    </div>
  );
};

/**
 * ThemeButton - Pre-styled button component that uses theme colors
 */
export const ThemeButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const theme = useThemeClasses();
  
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: `${theme.bgPrimary} text-white ${theme.bgHover} shadow-md hover:shadow-lg`,
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: `border-2 ${theme.borderPrimary} ${theme.textPrimary} hover:${theme.bgPrimary} hover:text-white bg-transparent`,
    ghost: `${theme.textPrimary} hover:${theme.bgPrimary} hover:text-white hover:bg-opacity-10`,
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * ThemeLink - Pre-styled link component that uses theme colors
 */
export const ThemeLink = ({ 
  children, 
  to, 
  onClick,
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const theme = useThemeClasses();
  
  const variantClasses = {
    default: `${theme.textPrimary} hover:${theme.textLight} underline-offset-4 hover:underline transition-colors`,
    button: `${theme.bgPrimary} ${theme.textLight} ${theme.bgHover} text-white px-4 py-2 rounded-lg font-semibold transition-all inline-block`,
    nav: `${theme.textLight} hover:text-white transition-colors`,
  };
  
  const Component = to ? 'a' : 'button';
  const componentProps = to ? { href: to } : { onClick, type: 'button' };
  
  return (
    <Component
      className={`${variantClasses[variant]} ${className}`}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  );
};

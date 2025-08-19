export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-md 
        border border-gray-200 dark:border-gray-700
        p-6
        transition-all duration-200
        ${hover ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

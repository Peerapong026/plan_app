"use client";

export function Button({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-gray-700 hover:from-blue-200 hover:to-pink-200",
    danger: "bg-red-300 text-red-700 hover:bg-red-200",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    info: "bg-blue-300 text-blue-700 hover:bg-blue-200",
  };

  return (
    <button
      className={`
        ${variants[variant] || variants.default}
        font-semibold text-sm tracking-wide 
        px-5 py-2.5 rounded-2xl shadow-md 
        transition duration-300 ease-in-out 
        transform hover:scale-[1.03] active:scale-95 
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

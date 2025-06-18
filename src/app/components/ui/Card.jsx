"use client";

export function Card({ children, className = "", variant = "default" }) {
  const variants = {
    default: "bg-white",
    soft: "bg-white/80 backdrop-blur-md",
    colored: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
    warning: "bg-yellow-50 border border-yellow-200",
    danger: "bg-red-50 border border-red-200",
  };

  return (
    <div
      className={`rounded-2xl shadow-md p-6 transition duration-300 hover:shadow-lg
        ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </div>
  );
}

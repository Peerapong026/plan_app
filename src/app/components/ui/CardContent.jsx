export function CardContent({ children, variant = "default", className = "" }) {
  const variants = {
    default: "text-gray-700",
    muted: "text-gray-500",
    info: "text-blue-700",
    warning: "text-yellow-800",
    danger: "text-red-700",
    success: "text-green-700",
  };

  return (
    <div className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </div>
  );
}

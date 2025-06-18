export function Progress({ value, variant = "success", className = "" }) {
  const variants = {
    success: "bg-green-500",
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    muted: "bg-gray-400",
  };

  const barColor = variants[variant] || variants.success;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`${barColor} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}

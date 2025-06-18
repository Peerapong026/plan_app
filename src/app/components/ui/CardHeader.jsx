export function CardHeader({ title, subtitle, variant = "default", className = "" }) {
  const variants = {
    default: {
      title: "text-gray-800",
      subtitle: "text-gray-500",
    },
    info: {
      title: "text-blue-800",
      subtitle: "text-blue-500",
    },
    success: {
      title: "text-green-800",
      subtitle: "text-green-500",
    },
    warning: {
      title: "text-yellow-800",
      subtitle: "text-yellow-600",
    },
    danger: {
      title: "text-red-800",
      subtitle: "text-red-500",
    },
  };

  const styles = variants[variant] || variants.default;

  return (
    <div className={`mb-4 ${className}`}>
      <h2 className={`text-xl font-bold ${styles.title}`}>{title}</h2>
      {subtitle && <p className={`text-sm ${styles.subtitle}`}>{subtitle}</p>}
    </div>
  );
}

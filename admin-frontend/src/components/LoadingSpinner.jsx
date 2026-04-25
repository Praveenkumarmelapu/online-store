export default function LoadingSpinner({ size = 'lg', text = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`${sizeClasses[size]} border-4 border-dark-200 border-t-primary-500 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-dark-500 text-sm">{text}</p>}
    </div>
  );
}

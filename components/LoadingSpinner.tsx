interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-sm text-secondary-600 dark:text-secondary-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

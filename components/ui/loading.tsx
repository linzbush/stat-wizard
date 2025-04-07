import { Loader2 } from "lucide-react"

export function LoadingSpinner({
  size = "default",
  className = "",
}: { size?: "small" | "default" | "large"; className?: string }) {
  const sizeClass = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-12 w-12",
  }[size]

  return <Loader2 className={`animate-spin ${sizeClass} ${className}`} />
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner className="text-purple-600 mb-4" />
      <p className="text-slate-600">{message}</p>
    </div>
  )
}


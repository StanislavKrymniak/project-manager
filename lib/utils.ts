import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-500/10 text-red-500 border-red-500/20"
    case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "Low": return "bg-green-500/10 text-green-500 border-green-500/20"
    default: return "bg-muted text-muted-foreground"
  }
}
const PRIORITY_CLASS_MAP: Record<string, string> = {
  "Extreme": "text-orange-700",
  "Moderate": "text-blue-500",
  "Low": "text-purple-700"
}

export function getPriorityColor(status: string): string {
  return PRIORITY_CLASS_MAP[status] || "text-destructive";
}

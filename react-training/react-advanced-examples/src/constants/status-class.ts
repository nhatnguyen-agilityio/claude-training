const STATUS_CLASS_MAP: Record<string, string> = {
  "Not Started": "text-destructive",
  "In Progress": "text-blue-700",
  "Completed": "text-green-700"
}

export function getStatusColor(status: string): string {
  return STATUS_CLASS_MAP[status] || "text-destructive";
}

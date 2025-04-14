export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function cn(...inputs: (string | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ")
}

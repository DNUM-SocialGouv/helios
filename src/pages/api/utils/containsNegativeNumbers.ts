export function containsNegativeNumbers(row: Record<string, any>): boolean {
  const values = Object.values(row);
  return values.some((value) => (typeof value === "number" && isNaN(value)) || value < 0);
}

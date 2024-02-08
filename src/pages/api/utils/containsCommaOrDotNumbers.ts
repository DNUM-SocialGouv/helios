export function containsCommaOrDotNumbers(row: Record<string, any>): boolean {
  const values = Object.values(row);
  return values.some((value) => typeof value === "string" && /^(\d+,\d+|\d+\.\d+)$/.test(value));
}

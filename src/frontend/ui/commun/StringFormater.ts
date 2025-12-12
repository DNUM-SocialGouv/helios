export namespace StringFormater {
  export function formatPhoneNumber(phoneNumber: string): string {
    return addSpaceForNCharacters(phoneNumber, 2);
  }

  // format DD/MM/AAAA
  export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function addSpaceForNCharacters(str: string, numberOfCharacters: number): string {
    return str
      .split("")
      .map((letter, index) => (index % numberOfCharacters === 0 ? " " + letter : letter))
      .join("")
      .trim();
  }

  export function formatInEuro(amount: number): string {
    return `${Math.round(amount).toLocaleString("fr")} €`.replace("-", "−");
  }

  export function formatAllInFrench(values: number[]): string[] {
    return values.map(formatInFrench);
  }

  export function formatInFrench(value: number): string {
    return value.toLocaleString("fr");
  }

  export function roundFormatInFrench(value: number): string {
    return formatInFrench(round(value, 2));
  }

  export function round(value: number, decimals: number = 2): number {
    const facteur = Math.pow(10, decimals);
    return Math.round(value * facteur) / facteur;
  }

  export function addPercent(value: string) {
    return value + " %";
  }

  export function formatCenterText(value: number) {
    return (value + " %").replace('.', ',');
  }

  export function removePercent(value: string) {
    return Number.parseFloat(value.slice(0, -2).replace(',', '.'));
  }

  export function addPercentToValues(values: number[]): string[] {
    return formatAllInFrench(values).map(addPercent);
  }

  export function transformInRate(number: number): number {
    return Math.round((number * 100) * 10) / 10;
  }

  export function transformInRoundedRate(number: number): number {
    return Math.round(number * 10) / 10;
  }

  export function formatNumberForExcel(value: string): string {
    return value?.replaceAll(/\s/g, '');
  }
}

const StringFormater = {
  formatPhoneNumber(phoneNumber: string): string {
    return StringFormater.addSpaceForNCharacters(phoneNumber, 2);
  },

  // format DD/MM/AAAA
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  },

  addSpaceForNCharacters(str: string, numberOfCharacters: number): string {
    return str
      .split("")
      .map((letter, index) => (index % numberOfCharacters === 0 ? " " + letter : letter))
      .join("")
      .trim();
  },

  formatInEuro(amount: number): string {
    return `${Math.round(amount).toLocaleString("fr")} €`.replace("-", "−");
  },

  formatAllInFrench(values: number[]): string[] {
    return values.map((v) => StringFormater.formatInFrench(v));
  },

  formatInFrench(value: number): string {
    return value.toLocaleString("fr");
  },

  roundFormatInFrench(value: number): string {
    return StringFormater.formatInFrench(StringFormater.round(value, 2));
  },

  round(value: number, decimals: number = 2): number {
    const facteur = Math.pow(10, decimals);
    return Math.round(value * facteur) / facteur;
  },

  addPercent(value: string) {
    return value + " %";
  },

  formatCenterText(value: number) {
    return (value + " %").replace('.', ',');
  },

  removePercent(value: string) {
    return Number.parseFloat(value.slice(0, -2).replace(',', '.'));
  },

  addPercentToValues(values: number[]): string[] {
    return StringFormater.formatAllInFrench(values).map((v) => StringFormater.addPercent(v));
  },

  transformInRate(number: number): number {
    return Math.round((number * 100) * 10) / 10;
  },

  transformInRoundedRate(number: number): number {
    return Math.round(number * 10) / 10;
  },

  formatNumberForExcel(value: string): string {
    return value?.replaceAll(/\s/g, '');
  },
}

export default StringFormater;


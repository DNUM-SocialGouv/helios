// Fonction pour vérifier si une année est valide (l'année en cours ou les 3 dernières années)
export function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= currentYear - 4 && year <= currentYear;
}

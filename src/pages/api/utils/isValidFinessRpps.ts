// Fonction pour vérifier si NDEG_FINESS_RPPS contient un nombre de 9 chiffres
export function isValidFinessRpps(value: string): boolean {
  return /^\d{9}$/.test(value);
}

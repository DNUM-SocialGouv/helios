export function estCeLAnnéePassée(année: number | string): boolean {
  return new Date().getFullYear() - 1 === Number(année);
}

export function annéesManquantes(années: (number | string)[], annéesTotales: number = 3): number[] {
  const annéeEnCours = new Date().getFullYear();

  return Array(annéesTotales)
    .fill(annéeEnCours)
    .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
    .reverse()
    .filter((année) => !années.includes(année));
}

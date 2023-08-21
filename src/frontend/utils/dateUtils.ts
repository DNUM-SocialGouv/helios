export function estCeLAnnéePassée(année: number | string): boolean {
  return new Date().getFullYear() - 1 === Number(année);
}

export function annéesManquantes(années: (number | string)[], annéesTotales: number = 3): number[] {
  const annéeEnCours = new Date().getFullYear();

  return Array(annéesTotales)
    .fill(annéeEnCours)
    .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
    .reverse()
    .filter((année) => !années.map(Number).includes(année));
}

// format DD/MM/AAAA - HHhMM
export function formatDateAndHours(date: string): string {
  const formated = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit",
    minute: "2-digit",
  });
  return (formated.replace(':', 'h').replace(' ', ' - '));
}



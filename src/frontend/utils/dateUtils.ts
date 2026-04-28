export function estCeLAnnéePassée(année: number | string): boolean {
  return new Date().getFullYear() - 1 === Number(année);
}

export function annéesManquantes(années: (number | string)[], annéesTotales: number = 3): number[] {
  const annéeEnCours = new Date().getFullYear();

  return new Array(annéesTotales)
    .fill(annéeEnCours)
    .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
    .reverse()
    .filter((année) => !années.map(Number).includes(année));
}

export function annéesManquantesVigieRh(années: (number | string)[], annéesTotales: number = 3): number[] {
  const annéeEnCours = new Date().getFullYear();

  return new Array(annéesTotales)
    .fill(annéeEnCours -1)
    .map((annéeÀAvoir, index) => annéeÀAvoir - index)
    .reverse()
    .filter((année) => !années.map(Number).includes(année));
}

function genererLesTrimestres(anneeDebut: number, anneeFin: number) {
  const quarters = [];
  for (let year = anneeDebut; year <= anneeFin; year++) {
    for (let q = 1; q <= 4; q++) {
      quarters.push(`${year}-T${q}`);
    }
  }
  return quarters;
}

export function trimestresManquantsVigieRh(trimestres: (number | string)[], annéesTotales: number = 3): string[] {
  const annéeEnCours = new Date().getFullYear();
  const expected = genererLesTrimestres(annéeEnCours - annéesTotales, annéeEnCours - 1);
  const trimestresManquants = expected.filter(q => !trimestres.includes(q));
  return trimestresManquants;
}

export function annéesManquantesQualite(années: (number | string)[], annéesTotales: number = 3): number[] {
  const annéeEnCours = new Date().getFullYear() + 1;

  return new Array(annéesTotales + 1)
    .fill(annéeEnCours)
    .map((annéeÀAvoir, index) => annéeÀAvoir - index - 1)
    .reverse()
    .filter((année) => !années.map(Number).includes(année));
}

// format DD/MM/AAAA - HHhMM
export function formatDateAndHours(date: string): string {
  const formated = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formated.replace(":", "h").replace(" ", " - ").replace(",", "");
}

export function convertDateDDMMYYYY(dateString: string) {
  const parts = dateString.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  } else {
    // Gérer les erreurs ou les formats de date incorrects
    return "Format de date incorrect";
  }
}

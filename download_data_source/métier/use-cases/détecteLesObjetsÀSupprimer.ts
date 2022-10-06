export function détecteLesObjetsÀSupprimer(numérosFinessDesNouveauxObjets: Set<string>, numérosFinessDesObjetsSauvegardés: Set<string>): string[] {
  const objetsÀSupprimer = []

  for (const numéroFinessSauvé of numérosFinessDesObjetsSauvegardés) {
    if (!numérosFinessDesNouveauxObjets.has(numéroFinessSauvé)) {
      objetsÀSupprimer.push(numéroFinessSauvé)
    }
  }

  return objetsÀSupprimer
}

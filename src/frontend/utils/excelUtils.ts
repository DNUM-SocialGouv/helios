import { Workbook, Worksheet } from "exceljs";


export function getIntervalCellulesNonVideDansColonne(sheet: Worksheet, colonne: number) {
  let premiereLigne: number | null = null;
  let derniereLigne: number | null = null;

  sheet.getColumn(colonne).eachCell({ includeEmpty: false }, (_cellule, ligne) => {
    premiereLigne ??= ligne;
    derniereLigne = ligne;
  });
  return (premiereLigne && derniereLigne) ? { premiereLigne, derniereLigne } : null;

}


export function ecrireLignesDansSheet(lignes: (string | number)[][], sheetComparaison: Worksheet) {
  lignes.forEach((valeursLignes, positionLigne) => {
    valeursLignes.forEach((valeur, positionColonne) => {
      sheetComparaison.getCell(1 + positionLigne, 1 + positionColonne).value = valeur as any;
    });
  });
}

export async function telechargerWorkbook(workbook: Workbook, nomFichier: string) {
  const hasDOM =
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function";

  // Dans un environnement Node/Jest -> Ecrire dans un fichier
  if (!hasDOM) {
    await workbook.xlsx.writeFile(nomFichier);
    return;
  }

  // Dans le navigateur -> Télécharger le fichier
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomFichier;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}

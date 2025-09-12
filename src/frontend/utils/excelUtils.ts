import { Worksheet, Workbook } from "exceljs";


export function getIntervalCellulesNonVideDansColonne(sheet: Worksheet, colonne: number) {
  let premiereLigne: number | null = null;
  let derniereLigne: number | null = null;

  sheet.getColumn(colonne).eachCell({ includeEmpty: false }, (_cellule, ligne) => {
    if (premiereLigne === null) premiereLigne = ligne;
    derniereLigne = ligne;
  });
  return (premiereLigne && derniereLigne) ? { premiereLigne, derniereLigne } : null;

}


export function ecrireLignesDansSheet(lignes: (string | Number)[][], sheetComparaison: Worksheet) {
  lignes.forEach((valeursLignes, positionLigne) => {
    valeursLignes.forEach((valeur, positionColonne) => {
      sheetComparaison.getCell(1 + positionLigne, 1 + positionColonne).value = valeur as any;
    });
  });
}



export async function telechargerWorkbookEnTantQueFichier(workbook: Workbook, nomFichier: string) {
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


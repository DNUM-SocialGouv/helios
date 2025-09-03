import * as XLSX from "xlsx";

import { EntiteJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}${month}${day}`;
  return currentDate;
}

export function useExportExcelETRattache(entiteJuridiqueViewModel: EntiteJuridiqueViewModel, etablissementsTerritoriauxRattachesViewModels: EtablissementsTerritoriauxRattachésViewModel) {
  function formatEtSanForExport(): string[][] {
    return etablissementsTerritoriauxRattachesViewModels.établissementSanitaires.map((rattache) => {
      return ["Sanitaire", rattache.numéroFiness, rattache.raisonSocialeCourte]
    });
  }

  function formatEtMedSocForExport(): string[][] {
    return etablissementsTerritoriauxRattachesViewModels.établissementMedicauxSociaux.map((rattache) => {
      return ["Social et Médico-Social", rattache.numéroFiness, rattache.raisonSocialeCourte]
    });
  }

  const exportEtRattache = () => {
    const header = [entiteJuridiqueViewModel.numéroFiness, entiteJuridiqueViewModel.nomDeLEntitéJuridique];
    const etabSan = formatEtSanForExport();
    const etabMedSoc = formatEtMedSocForExport();

    let ws;
    if (etablissementsTerritoriauxRattachesViewModels.plusDETSanitaire) {
      ws = XLSX.utils.aoa_to_sheet([header, [""], ...etabSan, ...etabMedSoc]);
    } else {
      ws = XLSX.utils.aoa_to_sheet([header, [""], ...etabMedSoc, ...etabSan]);
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etablissements rattachés");
    const fileName: string = `${getCurrentDate()}_Helios_${entiteJuridiqueViewModel.numéroFiness}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  return { exportEtRattache }
}

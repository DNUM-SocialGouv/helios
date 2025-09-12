import { Workbook } from "exceljs";

import { EntiteJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ecrireLignesDansSheet, telechargerWorkbook } from "../../utils/excelUtils";

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
      return ["Médico-Social", rattache.numéroFiness, rattache.raisonSocialeCourte]
    });
  }

  const exportEtRattache = () => {
    const header = [entiteJuridiqueViewModel.numéroFiness, entiteJuridiqueViewModel.nomDeLEntitéJuridique];
    const etabSan = formatEtSanForExport();
    const etabMedSoc = formatEtMedSocForExport();
    const etabHeader = [["Type d’établissement", "FINESS", "Raison sociale"]]

    const workbook = new Workbook();
    const sheet = workbook.addWorksheet("Etablissements rattachés");
    if (etablissementsTerritoriauxRattachesViewModels.plusDETSanitaire) {
      ecrireLignesDansSheet([header, [""], ...etabHeader, ...etabSan, ...etabMedSoc], sheet);
    } else {
      ecrireLignesDansSheet([header, [""], ...etabHeader, ...etabMedSoc, ...etabSan], sheet);
    }
    const fileName: string = `${getCurrentDate()}_Helios_${entiteJuridiqueViewModel.numéroFiness}.xlsx`;
    telechargerWorkbook(workbook, fileName);
  }

  return { exportEtRattache }
}

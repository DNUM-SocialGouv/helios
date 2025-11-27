import { Workbook } from 'exceljs';

import { ÉtablissementTerritorialMédicoSocialAutorisationsViewModel } from './ÉtablissementTerritorialMédicoSocialAutorisationsViewModel';
import { AutorisationMédicoSocialDiscipline } from '../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation';
import { ecrireLignesDansSheet, telechargerWorkbook } from '../../../utils/excelUtils';
import { useDependencies } from '../../commun/contexts/useDependencies';
import { StringFormater } from '../../commun/StringFormater';

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}${month}${day}`;
  return currentDate;
}
const dateOrEmpty = (date?: string | null) => date ? StringFormater.formatDate(date) : "";

export function useExportExcelAutorisationMS(numeroFinessEntiteJuridique: string, raisonSocialeEntiteJuridique: string, etablissementMSAutorisationsViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel) {
  const { wording } = useDependencies();

  function exportExcelAutorisationMS() {
    const workbook = new Workbook();
    const etabLine = `${numeroFinessEntiteJuridique} - ${raisonSocialeEntiteJuridique}`;

    if (etablissementMSAutorisationsViewModel.lesAutorisationsSontEllesAutorisées && etablissementMSAutorisationsViewModel.lesAutorisationsSontEllesRenseignées) {
      exportExcelAutorisationSMS(workbook, etabLine, etablissementMSAutorisationsViewModel);
    }
    const fileName: string = `${getCurrentDate()}_Helios_${numeroFinessEntiteJuridique}_Autorisations.xlsx`;
    telechargerWorkbook(workbook, fileName);
  }

  const exportExcelAutorisationSMS = (workbook: Workbook, etabLine: string, etablissementMSAutorisationsViewModel: ÉtablissementTerritorialMédicoSocialAutorisationsViewModel) => {
    const columns = ["Discipline", wording.ACTIVITÉ, "Clientèle", wording.DATE_D_AUTORISATION, wording.MISE_À_JOUR_AUTORISATION, wording.DERNIÈRE_INSTALLATION, wording.CAPACITÉ_AUTORISÉE, wording.CAPACITÉ_INSTALLÉE];

    const etablissementMSAutorisations = etablissementMSAutorisationsViewModel.établissementTerritorialAutorisations.autorisations;
    const rows: string[][] = [];

    const autorisationRows = getAutorisationRows(etablissementMSAutorisations.disciplines);
    rows.push(...autorisationRows);

    const sheet = workbook.addWorksheet("Autorisations");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  function getAutorisationRows(disciplines: AutorisationMédicoSocialDiscipline[]): string[][] {
    const result: string[][] = [];
    for (const discipline of disciplines) {
      const disciplineColumn = `${discipline.libellé} [${discipline.code}]`;
      for (const activite of discipline.activités) {
        const activiteColumn = `${activite.libellé} [${activite.code}]`;
        for (const clientele of activite.clientèles) {
          const clienteleColumn = `${clientele.libellé} [${clientele.code}]`;
          const dateCapacite = clientele.datesEtCapacités;
          result.push(
            [disciplineColumn, activiteColumn, clienteleColumn, dateOrEmpty(dateCapacite.dateDAutorisation), dateOrEmpty(dateCapacite.dateDeMiseÀJourDAutorisation), dateOrEmpty(dateCapacite.dateDeDernièreInstallation), dateCapacite.capacitéAutoriséeTotale !== null ? dateCapacite.capacitéAutoriséeTotale.toString() : "", dateCapacite.capacitéInstalléeTotale !== null ? dateCapacite.capacitéInstalléeTotale.toString() : ""]
          );
        }
      }
    }
    return result;
  };

  return { exportExcelAutorisationMS };
}

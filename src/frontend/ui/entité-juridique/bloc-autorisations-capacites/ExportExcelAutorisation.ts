import { Workbook } from 'exceljs';

import { EntitéJuridiqueAutorisationsCapacitesViewModel } from './EntitéJuridiqueAutorisationsCapacitesViewModel';
import {
  AutorisationActivitesAmm, AutorisationsActivités
} from '../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité';
import { ecrireLignesDansSheet, telechargerWorkbook } from '../../../utils/excelUtils';
import { useDependencies } from '../../commun/contexts/useDependencies';

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}${month}${day}`;
  return currentDate;
}

export function useExportExcelAutorisation(numeroFinessEntiteJuridique: string, raisonSocialeEntiteJuridique: string, entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel) {
  const { wording } = useDependencies();

  const autorisationFields = [wording.NUMÉRO_ARHGOS, wording.DATE_D_AUTORISATION_KEY, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];
  const autresAutorisationFields = [wording.DATE_D_AUTORISATION_KEY, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];
  const reconnaissanceFields = ["Capacité autorisée", "Date d'effet de l'ASR", "Auto. ARGHOS", "Date d'effet du CPOM", "Date de fin du CPOM", "Numéro de CPOM"];
  const equipementLourdFields = [wording.NUMÉRO_ARHGOS, wording.DATE_D_AUTORISATION_KEY, "Date de mis en oeuvre", wording.DATE_DE_FIN];

  function exportExcelAutorisation() {
    const workbook = new Workbook();
    const etabLine = `${numeroFinessEntiteJuridique} - ${raisonSocialeEntiteJuridique}`;

    if ((!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutorisationsActivitesNeSontPasAutorisées) {
      exportExcelAutorisationDeSoin(workbook, etabLine, entitéJuridiqueAutorisationsCapacitesViewModel);
    }
    if ((!entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesAutresActivitesNeSontPasAutorisées) {
      exportExcelAutresAutorisations(workbook, etabLine, entitéJuridiqueAutorisationsCapacitesViewModel);
    }
    if ((!entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesReconnaissanceContractuellesNeSontPasAutoriséess) {
      exportExcelReconnaissanceContractuelles(workbook, etabLine, entitéJuridiqueAutorisationsCapacitesViewModel);
    }
    if ((!entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasRenseignées()) && entitéJuridiqueAutorisationsCapacitesViewModel.lesEquipementsLourdsNeSontPasAutorisées) {
      exportExcelEquipementsLourds(workbook, etabLine, entitéJuridiqueAutorisationsCapacitesViewModel);
    }

    const fileName: string = `${getCurrentDate()}_Helios_${numeroFinessEntiteJuridique}_Autorisations.xlsx`;
    telechargerWorkbook(workbook, fileName);
  }

  const exportExcelAutorisationDeSoin = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel) => {
    const columns = [wording.ACTIVITÉ, "Modalité", "Mentions", "Pratiques", "Déclaration/Forme", "Autorisations Établissements", wording.NUMÉRO_ARHGOS, wording.DATE_D_AUTORISATION, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];

    const entiteJuridiqueAutorisations = entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsActivités;
    const entiteJuridiqueAutorisationsAmm = entitéJuridiqueAutorisationsCapacitesViewModel.autorisationsAmmActivites;
    const rows: string[][] = [];

    const ammRows = getAmmRows(entiteJuridiqueAutorisationsAmm.autorisations);
    rows.push(...ammRows);

    const autorisationRows = getAutorisationRows(entiteJuridiqueAutorisations);
    rows.push(...autorisationRows);

    const sheet = workbook.addWorksheet("Autorisations");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  function getAmmRows(autorisations: AutorisationActivitesAmm['autorisations']): string[][] {
    const result: string[][] = [];
    for (const activite of autorisations) {
      const activiteColumn = `${activite.libelle} [${activite.code}]`;
      for (const modalite of activite.modalites) {
        const modaliteColumn = `${modalite.libelle} [${modalite.code}]`;
        for (const mention of modalite.mentions) {
          const mentionColumn = `${mention.libelle} [${mention.code}]`;
          for (const pratique of mention.pratiques) {
            const pratiqueColumn = `${pratique.libelle} [${pratique.code}]`;
            for (const declaration of pratique.declarations) {
              const declarationColumn = `${declaration.libelle} [${declaration.code}]`;
              result.push(
                ...getEtablissementRows(declaration.autorisationAmmEtablissments, [activiteColumn, modaliteColumn, mentionColumn, pratiqueColumn, declarationColumn], autorisationFields)
              );
            }
          }
        }
      }
    }
    return result;
  };

  function getAutorisationRows(entiteJuridiqueAutorisations: AutorisationsActivités): string[][] {
    const result: string[][] = [];
    for (const activite of entiteJuridiqueAutorisations.autorisations) {
      const activiteColumn = `${activite.libelle} [${activite.code}]`;
      for (const modalite of activite.modalites) {
        const modaliteColumn = `${modalite.libelle} [${modalite.code}]`;
        for (const forme of modalite.formes) {
          const formeColumn = `${forme.libelle} [${forme.code}]`;
          result.push(
            ...getEtablissementRows(forme.autorisationEtablissements, [activiteColumn, modaliteColumn, "", "", formeColumn], autorisationFields)
          );
        }
      }
    }
    return result;
  }

  function getEtablissementRows(
    autorisationEtablissements: any[],
    prefixColumns: string[],
    fields: string[],
  ): string[][] {
    return autorisationEtablissements.map(etablissement => {
      const { etablissementColumn, fieldValues } = processEtablissement(etablissement, fields);
      return [
        ...prefixColumns,
        etablissementColumn,
        ...fieldValues
      ];
    });
  }

  const processEtablissement = (etablissement: any, fields: string[]) => {
    const etablissementColumn = `${etablissement.nomEtablissement} [${etablissement.numeroFiness}]`;
    const autorisationsMap: Record<string, string> = {};
    for (const autorisation of etablissement.autorisations) {
      autorisationsMap[autorisation.nom] = autorisation.valeur;
    }
    const fieldValues = fields.map(field => autorisationsMap[field] || '');
    return { etablissementColumn, fieldValues };
  };

  const exportExcelAutresAutorisations = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel) => {
    const columns = [wording.ACTIVITÉ, "Modalité", "Déclaration/Forme", "Autorisations Établissements", wording.DATE_D_AUTORISATION, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];

    const entiteJuridiqueAutresAutorisations = entitéJuridiqueAutorisationsCapacitesViewModel.autresActivités;
    const rows: string[][] = [];

    for (const activite of entiteJuridiqueAutresAutorisations.autorisations) {
      const activiteColumn = `${activite.libelle} [${activite.code}]`;
      for (const modalite of activite.modalites) {
        const modaliteColumn = `${modalite.libelle} [${modalite.code}]`;
        for (const forme of modalite.formes) {
          const formeColumn = `${forme.libelle} [${forme.code}]`;
          rows.push(
            ...getEtablissementRows(forme.autorisationEtablissements, [activiteColumn, modaliteColumn, formeColumn], autresAutorisationFields)
          );
        }
      }
    }

    const sheet = workbook.addWorksheet("Autres Autorisations");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  const exportExcelReconnaissanceContractuelles = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel) => {
    const columns = [wording.ACTIVITÉ, "Modalité", "Reconnaissance/Forme", "Autorisations Établissements", "Capacité autorisée", "Date d'effet de l'ASR", "Auto. ARGHOS", "Date d'effet du CPOM", "Date de fin du CPOM", "Numéro de CPOM"];

    const entiteJuridiqueReconnaissanceActivites = entitéJuridiqueAutorisationsCapacitesViewModel.reconnaissanceActivités;
    const rows: string[][] = [];

    for (const activite of entiteJuridiqueReconnaissanceActivites.autorisations) {
      const activiteColumn = `${activite.libelle} [${activite.code}]`;
      for (const modalite of activite.modalites) {
        const modaliteColumn = `${modalite.libelle} [${modalite.code}]`;
        for (const forme of modalite.formes) {
          const formeColumn = `${forme.libelle} [${forme.code}]`;
          rows.push(
            ...getEtablissementRows(forme.autorisationEtablissements, [activiteColumn, modaliteColumn, formeColumn], reconnaissanceFields)
          );
        }
      }
    }

    const sheet = workbook.addWorksheet("Reconnaissances Contractuelles");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  const exportExcelEquipementsLourds = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EntitéJuridiqueAutorisationsCapacitesViewModel) => {
    const columns = ["Équipement", "Autorisations Établissements", wording.NUMÉRO_ARHGOS, wording.DATE_D_AUTORISATION, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];

    const entiteJuridiqueEquipementsLourds = entitéJuridiqueAutorisationsCapacitesViewModel.equipementsLourds;
    const rows: string[][] = [];

    for (const equipement of entiteJuridiqueEquipementsLourds.autorisations) {
      const equipementColumn = `${equipement.libelle} [${equipement.code}]`;
      for (const equipementEtablissement of equipement.equipementEtablissements) {
        const equipementEtablissementColumn = `${equipementEtablissement.nomEtablissement} [${equipementEtablissement.numeroFiness}]`;
        rows.push(
          ...getEquipementAutorisationsRows(equipementEtablissement.equipements, [equipementColumn, equipementEtablissementColumn], equipementLourdFields)
        );
      }
    }

    const sheet = workbook.addWorksheet("Équipements Matériels Lourds");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  function getEquipementAutorisationsRows(
    autorisationEtablissements: any[],
    prefixColumns: string[],
    fields: string[],
  ): string[][] {
    return autorisationEtablissements.map(etablissement => {
      const fieldValues = processEquipementAutorisations(etablissement, fields);
      return [
        ...prefixColumns,
        ...fieldValues
      ];
    });
  }

  const processEquipementAutorisations = (etablissement: any, fields: string[]) => {
    const autorisationsMap: Record<string, string> = {};
    for (const autorisation of etablissement.autorisations) {
      autorisationsMap[autorisation.nom] = autorisation.valeur;
    }
    const fieldValues = fields.map(field => autorisationsMap[field] || '');
    return fieldValues;
  };


  return { exportExcelAutorisation };
}

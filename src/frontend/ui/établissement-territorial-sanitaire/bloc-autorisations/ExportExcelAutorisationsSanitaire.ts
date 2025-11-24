import { Workbook } from 'exceljs';

import { EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel } from "./ÉtablissementTerritorialSanitaireAutorisationsCapacitesViewModel";
import { AutorisationsAMMSanitaire, AutorisationSanitaireActivité } from '../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation';
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


export function useExportExcelAutorisationSanitaire(numeroFinessEntiteJuridique: string, raisonSocialeEntiteJuridique: string, etablissementTerritorialSanitaireAutorisationsCapacites: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel) {
  const { wording } = useDependencies();

  function exportExcelAutorisationSanitaire() {
    const workbook = new Workbook();
    const etabLine = `${numeroFinessEntiteJuridique} - ${raisonSocialeEntiteJuridique}`;

    if (etablissementTerritorialSanitaireAutorisationsCapacites.lesAutorisationsSontEllesRenseignées && etablissementTerritorialSanitaireAutorisationsCapacites.lesAutorisationsSontEllesAutorisées) {
      exportExcelAutorisationDeSoin(workbook, etabLine, etablissementTerritorialSanitaireAutorisationsCapacites);
    }
    if (etablissementTerritorialSanitaireAutorisationsCapacites.lesAutresActivitésSontEllesRenseignées && etablissementTerritorialSanitaireAutorisationsCapacites.lesAutresActivitésSontEllesAutorisées) {
      exportExcelAutresAutorisations(workbook, etabLine, etablissementTerritorialSanitaireAutorisationsCapacites);
    }
    if (etablissementTerritorialSanitaireAutorisationsCapacites.lesReconnaissancesContractuellesSontEllesRenseignées && etablissementTerritorialSanitaireAutorisationsCapacites.lesReconnaissancesContractuellesSontEllesAutorisées) {
      exportExcelReconnaissanceContractuelles(workbook, etabLine, etablissementTerritorialSanitaireAutorisationsCapacites);
    }
    if (etablissementTerritorialSanitaireAutorisationsCapacites.lesÉquipementsMatérielsLourdsSontIlsRenseignés && etablissementTerritorialSanitaireAutorisationsCapacites.lesÉquipementsMatérielsLourdsSontIlsAutorisés) {
      exportExcelEquipementsLourds(workbook, etabLine, etablissementTerritorialSanitaireAutorisationsCapacites);
    }

    const fileName: string = `${getCurrentDate()}_Helios_${numeroFinessEntiteJuridique}_Autorisations.xlsx`;
    telechargerWorkbook(workbook, fileName);
  }

  const exportExcelAutorisationDeSoin = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel) => {
    const columns = [wording.ACTIVITÉ, "Modalité", "Mentions", "Pratiques", "Déclaration/Forme", wording.NUMÉRO_ARHGOS, wording.DATE_D_AUTORISATION, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];

    const etablissementSanitaireAutorisations = entitéJuridiqueAutorisationsCapacitesViewModel.établissementTerritorialSanitaireAutorisations.autorisations;
    const etablissementSanitaireAutorisationsAmm = entitéJuridiqueAutorisationsCapacitesViewModel.établissementTerritorialSanitaireAutorisations.autorisationsAmm;
    const rows: string[][] = [];

    const ammRows = getAmmRows(etablissementSanitaireAutorisationsAmm.activites);
    rows.push(...ammRows);

    const autorisationRows = getAutorisationRows(etablissementSanitaireAutorisations.activités);
    rows.push(...autorisationRows);

    const sheet = workbook.addWorksheet("Autorisations");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  function getAmmRows(autorisations: AutorisationsAMMSanitaire[]): string[][] {
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
                [activiteColumn, modaliteColumn, mentionColumn, pratiqueColumn, declarationColumn, ...processEtablissement(declaration)]
              );
            }
          }
        }
      }
    }
    return result;
  };

  const processEtablissement = (declaration: any) => {
    return [
      declaration.codeAutorisationArhgos,
      dateOrEmpty(declaration.dateAutorisation),
      dateOrEmpty(declaration.dateMiseEnOeuvre),
      dateOrEmpty(declaration.dateFin)
    ]
  };

  function getAutorisationRows(etablissementSanitaireAutorisations: AutorisationSanitaireActivité[]): string[][] {
    const result: string[][] = [];
    for (const activite of etablissementSanitaireAutorisations) {
      const activiteColumn = `${activite.libellé} [${activite.code}]`;
      for (const modalite of activite.modalités) {
        const modaliteColumn = `${modalite.libellé} [${modalite.code}]`;
        for (const forme of modalite.formes) {
          const formeColumn = `${forme.libellé} [${forme.code}]`;
          const autorisationSanitaire = forme.autorisationSanitaire;
          result.push(
            [activiteColumn, modaliteColumn, "", "", formeColumn, autorisationSanitaire.numéroArhgos, dateOrEmpty(autorisationSanitaire.dateDAutorisation), dateOrEmpty(autorisationSanitaire.dateDeMiseEnOeuvre), dateOrEmpty(autorisationSanitaire.dateDeFin)]
          );
        }
      }
    }
    return result;
  }

  const exportExcelAutresAutorisations = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel) => {
    const columns = [wording.ACTIVITÉ, "Modalité", "Déclaration/Forme", wording.DATE_D_AUTORISATION, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];

    const etablissementSanitaireAutresAutorisations = entitéJuridiqueAutorisationsCapacitesViewModel.établissementTerritorialSanitaireAutorisations.autresActivités;
    const rows: string[][] = [];

    for (const activite of etablissementSanitaireAutresAutorisations.activités) {
      const activiteColumn = `${activite.libellé} [${activite.code}]`;
      for (const modalite of activite.modalités) {
        const modaliteColumn = `${modalite.libellé} [${modalite.code}]`;
        for (const forme of modalite.formes) {
          const formeColumn = `${forme.libellé} [${forme.code}]`;
          const autorisationSanitaire = forme.autreActivitéSanitaire;
          rows.push(
            [activiteColumn, modaliteColumn, formeColumn, dateOrEmpty(autorisationSanitaire.dateDAutorisation), dateOrEmpty(autorisationSanitaire.dateDeMiseEnOeuvre), dateOrEmpty(autorisationSanitaire.dateDeFin)]
          );
        }
      }
    }

    const sheet = workbook.addWorksheet("Autres Autorisations");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  const exportExcelReconnaissanceContractuelles = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel) => {
    const columns = [wording.ACTIVITÉ, "Modalité", "Reconnaissance/Forme", "Capacité autorisée", "Date d'effet de l'ASR", "Auto. ARGHOS", "Date d'effet du CPOM", "Date de fin du CPOM", "Numéro de CPOM"];

    const etablissementSanitaireReconnaissanceActivites = entitéJuridiqueAutorisationsCapacitesViewModel.établissementTerritorialSanitaireAutorisations.reconnaissancesContractuelles;
    const rows: string[][] = [];

    for (const activite of etablissementSanitaireReconnaissanceActivites.activités) {
      const activiteColumn = `${activite.libellé} [${activite.code}]`;
      for (const modalite of activite.modalités) {
        const modaliteColumn = `${modalite.libellé} [${modalite.code}]`;
        for (const forme of modalite.formes) {
          const formeColumn = `${forme.libellé} [${forme.code}]`;
          const reconnaissanceContractuelleSanitaire = forme.reconnaissanceContractuelleSanitaire;
          rows.push(
            [activiteColumn, modaliteColumn, formeColumn, reconnaissanceContractuelleSanitaire.capacitéAutorisée?.toString() || "", dateOrEmpty(reconnaissanceContractuelleSanitaire.dateDEffetAsr), reconnaissanceContractuelleSanitaire.numéroArhgos || "", dateOrEmpty(reconnaissanceContractuelleSanitaire.dateDEffetCpom), dateOrEmpty(reconnaissanceContractuelleSanitaire.dateDeFinCpom), reconnaissanceContractuelleSanitaire.numéroCpom]
          );
        }
      }
    }

    const sheet = workbook.addWorksheet("Reconnaissances Contractuelles");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  const exportExcelEquipementsLourds = (workbook: Workbook, etabLine: string, entitéJuridiqueAutorisationsCapacitesViewModel: EtablissementTerritorialSanitaireAutorisationsCapacitesViewModel) => {
    const columns = ["Équipement", wording.NUMÉRO_ARHGOS, wording.DATE_D_AUTORISATION, wording.DATE_DE_MISE_EN_OEUVRE, wording.DATE_DE_FIN];

    const etablissementSanitaireEquipementsLourds = entitéJuridiqueAutorisationsCapacitesViewModel.établissementTerritorialSanitaireAutorisations.équipementsMatérielsLourds;
    const rows: string[][] = [];

    for (const equipement of etablissementSanitaireEquipementsLourds.équipements) {
      const equipementColumn = `${equipement.libellé} [${equipement.code}]`;
      for (const autorisationEquipement of equipement.autorisations) {
        rows.push(
          [equipementColumn, autorisationEquipement.numéroArhgos || "", dateOrEmpty(autorisationEquipement.dateDAutorisation), dateOrEmpty(autorisationEquipement.dateDeMiseEnOeuvre), dateOrEmpty(autorisationEquipement.dateDeFin)]
        );
      }
    }

    const sheet = workbook.addWorksheet("Équipements Matériels Lourds");
    ecrireLignesDansSheet([[etabLine], [], columns, ...rows], sheet);
  }

  return { exportExcelAutorisationSanitaire };
}

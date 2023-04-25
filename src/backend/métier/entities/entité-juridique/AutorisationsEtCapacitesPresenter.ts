import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../../../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { StringFormater } from "../../../../frontend/ui/commun/StringFormater";
import { EntitéJuridique } from "./EntitéJuridique";
import {
  Autorisation,
  AutorisationActivites,
  AutorisationEtablissement,
  EntitéJuridiqueAutorisationEtCapacitéLoader,
  EquipementEtablissement,
  EquipementLourds,
  Equipements,
  Forme,
  Modalite,
} from "./EntitéJuridiqueAutorisationEtCapacité";

class AutorisationsFactory {
  static createFromAutorisationsSanitaire(autorisationsSanitaire: AutorisationSanitaireModel[]): AutorisationActivites[] {
    return autorisationsSanitaire.reduce((autorisationsActivites: AutorisationActivites[], autorisationSanitaire) => {
      const activite = this.findOrAddActivité(autorisationsActivites, autorisationSanitaire);
      const modalite = this.findOrAddModalité(activite, autorisationSanitaire);
      const forme = this.findOrAddForme(modalite, autorisationSanitaire);
      const etablissement = this.findOrAddEtablissement(forme, autorisationSanitaire);
      const autorisation = this.addAutorisation(autorisationSanitaire);

      etablissement.autorisations.push(...autorisation);
      return autorisationsActivites;
    }, []);
  }

  static createFromAutresActivitesSanitaire(autreActivitesSanitaire: AutreActivitéSanitaireModel[]): AutorisationActivites[] {
    return autreActivitesSanitaire.reduce((autreActivites: AutorisationActivites[], autreActiviteSanitaire) => {
      const activite = this.findOrAddActivité(autreActivites, autreActiviteSanitaire);
      const modalite = this.findOrAddModalité(activite, autreActiviteSanitaire);
      const forme = this.findOrAddForme(modalite, autreActiviteSanitaire);
      const etablissement = this.findOrAddEtablissement(forme, autreActiviteSanitaire);
      const autorisation = this.addAutresActivites(autreActiviteSanitaire);

      etablissement.autorisations.push(...autorisation);
      return autreActivites;
    }, []);
  }

  static createFromReconnaissanceContractuellesSanitaire(
    reconnaissanceContractuelleSanitaire: ReconnaissanceContractuelleSanitaireModel[]
  ): AutorisationActivites[] {
    return reconnaissanceContractuelleSanitaire.reduce((reconnaissancesContractuelles: AutorisationActivites[], reconnaissanceContractuelle) => {
      const activite = this.findOrAddActivité(reconnaissancesContractuelles, reconnaissanceContractuelle);
      const modalite = this.findOrAddModalité(activite, reconnaissanceContractuelle);
      const forme = this.findOrAddForme(modalite, reconnaissanceContractuelle);
      const etablissement = this.findOrAddEtablissement(forme, reconnaissanceContractuelle);
      const autorisation = this.addReconnaissanceContractuelles(reconnaissanceContractuelle);

      etablissement.autorisations.push(...autorisation);
      return reconnaissancesContractuelles;
    }, []);
  }

  private static findOrAddActivité(
    autorisationActivites: AutorisationActivites[],
    autorisationSanitaire: { libelléActivité: string; codeActivité: string }
  ): AutorisationActivites {
    let activite = autorisationActivites.find((a) => a.code === autorisationSanitaire.codeActivité);

    if (!activite) {
      activite = {
        modalites: [],
        libelle: autorisationSanitaire.libelléActivité,
        code: autorisationSanitaire.codeActivité,
      };
      autorisationActivites.push(activite);
    }

    return activite;
  }

  private static findOrAddModalité(activite: AutorisationActivites, autorisationSanitaire: { codeModalité: string; libelléModalité: string }): Modalite {
    let modalite = activite.modalites.find((m) => m.code === autorisationSanitaire.codeModalité);

    if (!modalite) {
      modalite = {
        formes: [],
        code: autorisationSanitaire.codeModalité,
        libelle: autorisationSanitaire.libelléModalité,
      };
      activite.modalites.push(modalite);
    }

    return modalite;
  }

  private static findOrAddForme(modalite: Modalite, autorisationSanitaire: { codeForme: string; libelléForme: string }): Forme {
    let forme = modalite.formes.find((f) => f.code === autorisationSanitaire.codeForme);

    if (!forme) {
      forme = {
        autorisationEtablissements: [],
        code: autorisationSanitaire.codeForme,
        libelle: autorisationSanitaire.libelléForme,
      };
      modalite.formes.push(forme);
    }

    return forme;
  }

  private static findOrAddEtablissement(
    forme: Forme,
    autorisationSanitaire: {
      numéroFinessÉtablissementTerritorial: string;
      établissementTerritorial: { raisonSocialeCourte: string };
    }
  ): AutorisationEtablissement {
    let etablissement = forme.autorisationEtablissements.find((e) => e.numeroFiness === autorisationSanitaire.numéroFinessÉtablissementTerritorial);

    if (!etablissement) {
      etablissement = {
        numeroFiness: autorisationSanitaire.numéroFinessÉtablissementTerritorial,
        nomEtablissement: autorisationSanitaire.établissementTerritorial.raisonSocialeCourte,
        autorisations: [],
      };
      forme.autorisationEtablissements.push(etablissement);
    }

    return etablissement;
  }

  private static addAutorisation(autorisationSanitaire: {
    dateAutorisation: string;
    dateMiseEnOeuvre: string;
    dateFin: string;
    numéroAutorisationArhgos: string;
  }): Autorisation[] {
    return [
      {
        nom: "Numéro ARHGOS",
        valeur: autorisationSanitaire.numéroAutorisationArhgos,
      },
      {
        nom: "Date d'autorisation",
        valeur: autorisationSanitaire.dateAutorisation ? StringFormater.formatDate(autorisationSanitaire.dateAutorisation) : "N/A",
      },
      {
        nom: "Date de mise en oeuvre",
        valeur: autorisationSanitaire.dateMiseEnOeuvre ? StringFormater.formatDate(autorisationSanitaire.dateMiseEnOeuvre) : "N/A",
      },
      {
        nom: "Date de fin",
        valeur: autorisationSanitaire.dateFin ? StringFormater.formatDate(autorisationSanitaire.dateFin) : "N/A",
      },
    ];
  }

  private static addAutresActivites(autresActivites: { dateAutorisation: string; dateMiseEnOeuvre: string; dateFin: string }): Autorisation[] {
    return [
      {
        nom: "Date d'autorisation",
        valeur: autresActivites.dateAutorisation ? StringFormater.formatDate(autresActivites.dateAutorisation) : "N/A",
      },
      {
        nom: "Date de mise en oeuvre",
        valeur: autresActivites.dateMiseEnOeuvre ? StringFormater.formatDate(autresActivites.dateMiseEnOeuvre) : "N/A",
      },
      {
        nom: "Date de fin",
        valeur: autresActivites.dateFin ? StringFormater.formatDate(autresActivites.dateFin) : "N/A",
      },
    ];
  }

  private static addReconnaissanceContractuelles(reconnaissanceContractuelle: {
    capacitéAutorisée: number;
    dateEffetAsr: string;
    numéroAutorisationArhgos: string;
    dateEffetCpom: string;
    dateFinCpom: string;
    numéroCpom: string;
  }): Autorisation[] {
    return [
      {
        nom: "Capacité autorisée",
        valeur: reconnaissanceContractuelle.capacitéAutorisée ? reconnaissanceContractuelle.capacitéAutorisée.toString() : "N/A",
      },
      {
        nom: "Date d'effet de l'ASR",
        valeur: reconnaissanceContractuelle.dateEffetAsr ? StringFormater.formatDate(reconnaissanceContractuelle.dateEffetAsr) : "N/A",
      },
      {
        nom: "Auto. ARGHOS",
        valeur: reconnaissanceContractuelle.numéroAutorisationArhgos,
      },
      {
        nom: "Date d'effet du CPOM",
        valeur: reconnaissanceContractuelle.dateEffetCpom ? StringFormater.formatDate(reconnaissanceContractuelle.dateEffetCpom) : "N/A",
      },
      {
        nom: "Date de fin du CPOM",
        valeur: reconnaissanceContractuelle.dateFinCpom ? StringFormater.formatDate(reconnaissanceContractuelle.dateFinCpom) : "N/A",
      },
      {
        nom: "Numéro de CPOM",
        valeur: reconnaissanceContractuelle.numéroCpom,
      },
    ];
  }
}

export class AutorisationsEtCapacitesPresenter {
  static present(autorisationsEtCapacites: EntitéJuridiqueAutorisationEtCapacitéLoader): EntitéJuridique["autorisationsEtCapacites"] {
    const autorisationsActivites = AutorisationsFactory.createFromAutorisationsSanitaire(autorisationsEtCapacites.autorisationsSanitaire.autorisations);
    const autresActivites = AutorisationsFactory.createFromAutresActivitesSanitaire(autorisationsEtCapacites.autresActivitesSanitaire.autorisations);
    const reconnaissanceContractuellesActivites = AutorisationsFactory.createFromReconnaissanceContractuellesSanitaire(
      autorisationsEtCapacites.reconnaissanceContractuellesSanitaire.autorisations
    );
    const equipementMateriauxLourdsActivites = EquipementFactory.createFromEquipementMaterielLourdSanitaire(
      autorisationsEtCapacites.equipementMaterielLourdSanitaire.autorisations
    );

    return {
      numéroFinessEntitéJuridique: autorisationsEtCapacites.numéroFinessEntitéJuridique,
      capacités: autorisationsEtCapacites.capacités,
      autorisationsActivités: {
        autorisations: this.sortAutorisationActivites(autorisationsActivites),
        dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.autorisationsSanitaire.dateMiseÀJourSource),
      },
      autresActivités: {
        autorisations: this.sortAutorisationActivites(autresActivites),
        dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.autresActivitesSanitaire.dateMiseÀJourSource),
      },
      reconnaissanceContractuelleActivités: {
        autorisations: this.sortAutorisationActivites(reconnaissanceContractuellesActivites),
        dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.reconnaissanceContractuellesSanitaire.dateMiseÀJourSource),
      },
      equipementMaterielLordsActivités: {
        autorisations: this.sortEquipementsLourds(equipementMateriauxLourdsActivites),
        dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.equipementMaterielLourdSanitaire.dateMiseÀJourSource),
      },
    };
  }

  private static sortAutorisationActivites(data: AutorisationActivites[]): AutorisationActivites[] {
    return data
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((autorisationActivite) => ({
        ...autorisationActivite,
        modalites: autorisationActivite.modalites
          .sort((a, b) => a.code.localeCompare(b.code))
          .map((modalite) => ({
            ...modalite,
            formes: modalite.formes
              .sort((a, b) => a.code.localeCompare(b.code))
              .map((forme) => {
                return {
                  ...forme,
                  autorisationEtablissements: forme.autorisationEtablissements.sort((a, b) => a.numeroFiness.localeCompare(b.numeroFiness)),
                };
              }),
          })),
      }));
  }

  private static sortEquipementsLourds(data: EquipementLourds[]): EquipementLourds[] {
    return data
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((equipementLourd) => ({
        ...equipementLourd,
        equipementEtablissements: equipementLourd.equipementEtablissements.sort((a, b) => a.numeroFiness.localeCompare(b.numeroFiness)),
      }));
  }
}

export class EquipementFactory {
  static createFromEquipementMaterielLourdSanitaire(equipementMaterielLourdModel: ÉquipementMatérielLourdSanitaireModel[]): EquipementLourds[] {
    return equipementMaterielLourdModel.reduce((equipementsLourds: EquipementLourds[], equipementLourdModel) => {
      const equipementMaterielLourd = this.findOrAddEquipementsLourds(equipementsLourds, equipementLourdModel);
      const etablissement = this.findOrAddEtablissement(equipementMaterielLourd, equipementLourdModel);
      this.findOrAddEquipements(etablissement, equipementLourdModel);
      return equipementsLourds;
    }, []);
  }

  private static findOrAddEquipementsLourds(
    equipementLourds: EquipementLourds[],
    equipementSanitaire: ÉquipementMatérielLourdSanitaireModel
  ): EquipementLourds {
    let equipement = equipementLourds.find((a) => a.code === equipementSanitaire.codeÉquipementMatérielLourd);

    if (!equipement) {
      equipement = {
        equipementEtablissements: [],
        libelle: equipementSanitaire.libelléÉquipementMatérielLourd,
        code: equipementSanitaire.codeÉquipementMatérielLourd,
      };
      equipementLourds.push(equipement);
    }

    return equipement;
  }

  private static findOrAddEtablissement(
    equipementEtablissement: EquipementLourds,
    equipementSanitaire: {
      numéroFinessÉtablissementTerritorial: string;
      établissementTerritorial: { raisonSocialeCourte: string };
    }
  ): EquipementEtablissement {
    let etablissement = equipementEtablissement.equipementEtablissements.find(
      (e) => e.numeroFiness === equipementSanitaire.numéroFinessÉtablissementTerritorial
    );

    if (!etablissement) {
      etablissement = {
        numeroFiness: equipementSanitaire.numéroFinessÉtablissementTerritorial,
        nomEtablissement: equipementSanitaire.établissementTerritorial.raisonSocialeCourte,
        equipements: [],
      };
      equipementEtablissement.equipementEtablissements.push(etablissement);
    }

    return etablissement;
  }

  private static findOrAddEquipements(
    equipementEtablissement: EquipementEtablissement,
    equipementLourdModel: ÉquipementMatérielLourdSanitaireModel
  ): Equipements {
    equipementEtablissement.equipements.push({ autorisations: this.addEquipementMaterielLourd(equipementLourdModel) });
    return equipementEtablissement.equipements[equipementEtablissement.equipements.length - 1];
  }

  private static addEquipementMaterielLourd(equipementMaterielLourd: {
    numéroAutorisationArhgos: string;
    dateAutorisation: string;
    dateMiseEnOeuvre: string;
    dateFin: string;
  }): Autorisation[] {
    return [
      {
        nom: "Numéro ARHGOS",
        valeur: equipementMaterielLourd.numéroAutorisationArhgos,
      },
      {
        nom: "Date d'autorisation",
        valeur: equipementMaterielLourd.dateAutorisation ? StringFormater.formatDate(equipementMaterielLourd.dateAutorisation) : "N/A",
      },
      {
        nom: "Date de mis en oeuvre",
        valeur: equipementMaterielLourd.dateMiseEnOeuvre ? StringFormater.formatDate(equipementMaterielLourd.dateMiseEnOeuvre) : "N/A",
      },
      {
        nom: "Date de fin",
        valeur: equipementMaterielLourd.dateFin ? StringFormater.formatDate(equipementMaterielLourd.dateFin) : "N/A",
      },
    ];
  }
}

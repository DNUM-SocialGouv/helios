import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { StringFormater } from "../../../../frontend/ui/commun/StringFormater";
import { Autorisation, AutorisationActivites, AutorisationEtablissement, Forme, Modalite } from "./EntitéJuridiqueAutorisationEtCapacité";

export class AutorisationsFactory {
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

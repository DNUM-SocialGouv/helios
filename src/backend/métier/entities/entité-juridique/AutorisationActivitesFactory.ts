import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { AutorisationEtAutresActivitesSanitaire } from "./AutorisationEtAutresActivitesSanitaire";
import { Autorisation, AutorisationActivites, AutorisationEtablissement, Forme, Modalite } from "./EntitéJuridiqueAutorisationEtCapacité";

export class AutorisationActivitesFactory {
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
      const autorisation = this.addAutorisation(autreActiviteSanitaire);

      etablissement.autorisations.push(...autorisation);
      return autreActivites;
    }, []);
  }

  private static findOrAddActivité(
    autorisationActivites: AutorisationActivites[],
    autorisationSanitaire: AutorisationEtAutresActivitesSanitaire<any>
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

  private static findOrAddModalité(activite: AutorisationActivites, autorisationSanitaire: AutorisationEtAutresActivitesSanitaire<any>): Modalite {
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

  private static findOrAddForme(modalite: Modalite, autorisationSanitaire: AutorisationEtAutresActivitesSanitaire<any>): Forme {
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

  private static findOrAddEtablissement(forme: Forme, autorisationSanitaire: AutorisationEtAutresActivitesSanitaire<any>): AutorisationEtablissement {
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

  private static addAutorisation(autorisationSanitaire: AutorisationEtAutresActivitesSanitaire<any>): Autorisation[] {
    if (autorisationSanitaire.numéroAutorisationArhgos === undefined) {
      return [
        {
          nom: "Date d'autorisation",
          valeur: autorisationSanitaire.dateAutorisation,
        },
        {
          nom: "Date de mise en oeuvre",
          valeur: autorisationSanitaire.dateMiseEnOeuvre,
        },
        {
          nom: "Date de fin",
          valeur: autorisationSanitaire.dateFin,
        },
      ];
    } else {
      return [
        {
          nom: "Numéro ARHGOS",
          valeur: autorisationSanitaire.numéroAutorisationArhgos,
        },
        {
          nom: "Date d'autorisation",
          valeur: autorisationSanitaire.dateAutorisation,
        },
        {
          nom: "Date de mise en oeuvre",
          valeur: autorisationSanitaire.dateMiseEnOeuvre,
        },
        {
          nom: "Date de fin",
          valeur: autorisationSanitaire.dateFin,
        },
      ];
    }
  }
}

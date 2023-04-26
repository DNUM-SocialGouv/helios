import { DataSource } from "typeorm";

import { ActivitéSanitaireEntitéJuridiqueModel } from "../../../../../database/models/ActivitéSanitaireEntitéJuridiqueModel";
import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { BudgetEtFinancesEntiteJuridiqueModel } from "../../../../../database/models/BudgetEtFinancesEntiteJuridiqueModel";
import { CapacitesSanitaireEntiteJuridiqueModel } from "../../../../../database/models/CapacitesSanitaireEntiteJuridiqueModel";
import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../../../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { CatégorisationEnum, EntitéJuridiqueIdentité } from "../../../métier/entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../../../métier/entities/entité-juridique/EntitéJuridiqueActivités";
import {
  CapacitéSanitaireEntitéJuridique,
  EntitéJuridiqueAutorisationEtCapacitéLoader,
} from "../../../métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "../../../métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EntitéJuridiqueNonTrouvée } from "../../../métier/entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";
import { EntitéJuridiqueLoader } from "../../../métier/gateways/EntitéJuridiqueLoader";

export class TypeOrmEntitéJuridiqueLoader implements EntitéJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeIdentité(numéroFiness: string): Promise<EntitéJuridiqueIdentité | EntitéJuridiqueNonTrouvée> {
    const entitéJuridiqueIdentitéModel = await this.chargeLIdentitéModel(numéroFiness);

    if (!entitéJuridiqueIdentitéModel) {
      return new EntitéJuridiqueNonTrouvée(numéroFiness);
    }

    const dateDeMiseAJourFichierSourceModel = (await this.chargeLaDateDeMiseÀJourFinessCs1400101Model()) as DateMiseÀJourFichierSourceModel;

    return this.construisLEntitéJuridique(entitéJuridiqueIdentitéModel, dateDeMiseAJourFichierSourceModel);
  }

  async chargeRattachement(numéroFiness: string): Promise<EntitéJuridiqueDeRattachement> {
    const entitéJuridiqueModel = (await this.chargeLIdentitéModel(numéroFiness)) as EntitéJuridiqueModel;
    const dateDeMiseAJourFichierSourceModel = (await this.chargeLaDateDeMiseÀJourFinessCs1400101Model()) as DateMiseÀJourFichierSourceModel;

    return this.construisLEntitéJuridiqueDeRattachement(entitéJuridiqueModel, dateDeMiseAJourFichierSourceModel);
  }

  private async chargeLaDateDeMiseÀJourFinessCs1400101Model(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: FichierSource.FINESS_CS1400101 });
  }

  private async chargeLIdentitéModel(numéroFinessEntitéJuridique: string): Promise<EntitéJuridiqueModel | null> {
    return await (await this.orm).getRepository(EntitéJuridiqueModel).findOneBy({ numéroFinessEntitéJuridique });
  }

  async chargeActivités(numéroFinessEntitéJuridique: string): Promise<EntitéJuridiqueActivités[]> {
    const activiteSanitareEJModel = await (await this.orm).getRepository(ActivitéSanitaireEntitéJuridiqueModel).find({
      where: { numéroFinessEntitéJuridique },
    });

    const dateMisAJourRPU = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_ANN_RPU })) as DateMiseÀJourFichierSourceModel;

    const dateMiseAJourMenPmsi = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_MEN_PMSI_ANNUEL })) as DateMiseÀJourFichierSourceModel;

    return this.construisEntitéJuridiqueActivites(activiteSanitareEJModel, dateMisAJourRPU, dateMiseAJourMenPmsi);
  }

  private construisEntitéJuridiqueActivites(
    activiteSanitaireEJModel: ActivitéSanitaireEntitéJuridiqueModel[],
    dateMisAJourRPU: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourMenPmsiAnnuel: DateMiseÀJourFichierSourceModel
  ): EntitéJuridiqueActivités[] {
    return activiteSanitaireEJModel.map((activite) => ({
      année: activite.année,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: dateMisAJourRPU.dernièreMiseÀJour,
        value: activite.nombreDePassagesAuxUrgences,
      },
      nombreJournéesCompletesPsy: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreJournéesCompletesPsy,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreJournéesCompletesSsr,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreJournéesPartiellesPsy,
      },
      nombreJournéesPartiellesSsr: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreJournéesPartiellesSsr,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursCompletsChirurgie,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursCompletsMédecine,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursCompletsObstétrique,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursPartielsChirurgie,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursPartielsMédecine,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursPartielsObstétrique,
      },
      nombreSéjoursHad: {
        dateMiseÀJourSource: dateDeMiseAJourMenPmsiAnnuel.dernièreMiseÀJour,
        value: activite.nombreSéjoursHad,
      },
    }));
  }

  private construisLEntitéJuridique(
    entitéJuridiqueModel: EntitéJuridiqueModel,
    dateDeMiseAJourFichierSourceModel: DateMiseÀJourFichierSourceModel
  ): EntitéJuridiqueIdentité {
    return {
      adresseAcheminement: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseAcheminement,
      },
      adresseNuméroVoie: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseNuméroVoie,
      },
      adresseTypeVoie: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseTypeVoie,
      },
      adresseVoie: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.adresseVoie,
      },
      catégorisation: entitéJuridiqueModel.catégorisation as CatégorisationEnum,
      libelléStatutJuridique: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.libelléStatutJuridique,
      },
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.numéroFinessEntitéJuridique,
      },
      raisonSociale: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.raisonSociale,
      },
      raisonSocialeCourte: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.raisonSocialeCourte,
      },
      siren: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.siren,
      },
      téléphone: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.téléphone,
      },
    };
  }

  private construisLEntitéJuridiqueDeRattachement(
    entitéJuridiqueModel: EntitéJuridiqueModel,
    dateDeMiseAJourFichierSourceModel: DateMiseÀJourFichierSourceModel
  ): EntitéJuridiqueDeRattachement {
    return {
      raisonSocialeDeLEntitéDeRattachement: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.raisonSocialeCourte,
      },
      statutJuridique: {
        dateMiseÀJourSource: dateDeMiseAJourFichierSourceModel.dernièreMiseÀJour,
        value: entitéJuridiqueModel.libelléStatutJuridique,
      },
    };
  }

  async chargeBudgetFinance(numéroFinessEntitéJuridique: string): Promise<EntitéJuridiqueBudgetFinance[]> {
    const budgetFinance = await (await this.orm).getRepository(BudgetEtFinancesEntiteJuridiqueModel).find({
      where: { numéroFinessEntitéJuridique },
    });

    const dateMisAJour = (await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_QUO_SAN_FINANCE })) as DateMiseÀJourFichierSourceModel;

    return this.construisBudgetFinanceEJ(budgetFinance, dateMisAJour);
  }

  private construisBudgetFinanceEJ(
    budgetFinance: BudgetEtFinancesEntiteJuridiqueModel[],
    dateMisAJour: DateMiseÀJourFichierSourceModel
  ): EntitéJuridiqueBudgetFinance[] {
    return budgetFinance.map((budget) => ({
      année: budget.année,
      dateMiseÀJourSource: dateMisAJour.dernièreMiseÀJour,
      depensesTitreIGlobal: budget.depensesTitreIGlobal,
      depensesTitreIIGlobal: budget.depensesTitreIIGlobal,
      depensesTitreIIIGlobal: budget.depensesTitreIIIGlobal,
      depensesTitreIVGlobal: budget.depensesTitreIVGlobal,
      totalDepensesGlobal: budget.depensesTitreIGlobal + budget.depensesTitreIIGlobal + budget.depensesTitreIIIGlobal + budget.depensesTitreIVGlobal,

      recettesTitreIGlobal: budget.recettesTitreIGlobal,
      recettesTitreIIGlobal: budget.recettesTitreIIGlobal,
      recettesTitreIIIGlobal: budget.recettesTitreIIIGlobal,
      recettesTitreIVGlobal: budget.recettesTitreIVGlobal,
      totalRecettesGlobal: budget.recettesTitreIGlobal + budget.recettesTitreIIGlobal + budget.recettesTitreIIIGlobal + budget.recettesTitreIVGlobal,

      depensesTitreIPrincipales: budget.depensesTitreIH,
      depensesTitreIIPrincipales: budget.depensesTitreIIH,
      depensesTitreIIIPrincipales: budget.depensesTitreIIIH,
      depensesTitreIVPrincipales: budget.depensesTitreIVH,
      totalDepensesPrincipales: budget.depensesTitreIH + budget.depensesTitreIIH + budget.depensesTitreIIIH + budget.depensesTitreIVH,

      recettesTitreIPrincipales: budget.recettesTitreIH,
      recettesTitreIIPrincipales: budget.recettesTitreIIH,
      recettesTitreIIIPrincipales: budget.recettesTitreIIIH,
      totalRecettesPrincipales: budget.recettesTitreIH + budget.recettesTitreIIH + budget.recettesTitreIIIH,

      depensesTitreIAnnexe: budget.depensesTitreIGlobal - budget.depensesTitreIH,
      depensesTitreIIAnnexe: budget.depensesTitreIIGlobal - budget.depensesTitreIIH,
      depensesTitreIIIAnnexe: budget.depensesTitreIIIGlobal - budget.depensesTitreIIIH,
      depensesTitreIVAnnexe: budget.depensesTitreIVGlobal - budget.depensesTitreIVH,
      totalDepensesAnnexe:
        budget.depensesTitreIGlobal -
        budget.depensesTitreIH +
        (budget.depensesTitreIIGlobal - budget.depensesTitreIIH) +
        (budget.depensesTitreIIIGlobal - budget.depensesTitreIIIH) +
        (budget.depensesTitreIVGlobal - budget.depensesTitreIVH),

      recettesTitreIAnnexe: budget.recettesTitreIGlobal - budget.recettesTitreIH,
      recettesTitreIIAnnexe: budget.recettesTitreIIGlobal - budget.recettesTitreIIH,
      recettesTitreIIIAnnexe: budget.recettesTitreIIIGlobal - budget.recettesTitreIIIH,
      recettesTitreIVAnnexe: budget.recettesTitreIVGlobal,
      totalRecettesAnnexe:
        budget.recettesTitreIGlobal -
        budget.recettesTitreIH +
        (budget.recettesTitreIIGlobal - budget.recettesTitreIIH) +
        (budget.recettesTitreIIIGlobal - budget.recettesTitreIIIH) +
        budget.recettesTitreIVGlobal,
      resultatNetComptable: budget.resultatNetComptableSan,
      ratioDependanceFinanciere: budget.ratioDependanceFinanciere,
      tauxDeCafNetSan: budget.tauxDeCafNetteSan,
    }));
  }

  async chargeAutorisationsEtCapacités(numéroFinessEntitéJuridique: string): Promise<EntitéJuridiqueAutorisationEtCapacitéLoader> {
    const capacitésDeLÉtablissementModel = await this.chargeLesCapacitésModel(numéroFinessEntitéJuridique);
    const dateDeMiseÀJourDiamantAnnSaeModel = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_SAE)) as DateMiseÀJourFichierSourceModel;
    const dateDeMiseÀJourFinessCs1400103Model = (await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400103)) as DateMiseÀJourFichierSourceModel;
    const autorisationsSanitaire = await this.chargeLesAutorisationsSanitaires(numéroFinessEntitéJuridique);
    const autresActivitesSanitaire = await this.chargeLesAutresActivitesSanitaires(numéroFinessEntitéJuridique);
    const reconnaissanceContractuellesSanitaire = await this.chargeLesReconnaissanceContractuellesSanitaires(numéroFinessEntitéJuridique);
    const equipementMaterielLourdsSanitaire = await this.chargeLesEquipementsMaterielLourdsSanitaire(numéroFinessEntitéJuridique);

    return {
      capacités: this.construisLesCapacités(capacitésDeLÉtablissementModel, dateDeMiseÀJourDiamantAnnSaeModel),
      autorisationsSanitaire: { autorisations: autorisationsSanitaire, dateMiseÀJourSource: dateDeMiseÀJourFinessCs1400103Model.dernièreMiseÀJour },
      autresActivitesSanitaire: { autorisations: autresActivitesSanitaire, dateMiseÀJourSource: dateDeMiseÀJourFinessCs1400103Model.dernièreMiseÀJour },
      reconnaissanceContractuellesSanitaire: {
        autorisations: reconnaissanceContractuellesSanitaire,
        dateMiseÀJourSource: dateDeMiseÀJourFinessCs1400103Model.dernièreMiseÀJour,
      },
      equipementMaterielLourdSanitaire: {
        autorisations: equipementMaterielLourdsSanitaire,
        dateMiseÀJourSource: dateDeMiseÀJourFinessCs1400103Model.dernièreMiseÀJour,
      },
      numéroFinessEntitéJuridique,
    };
  }

  private async chargeLesAutorisationsSanitaires(numéroFinessEntitéJuridique: string): Promise<AutorisationSanitaireModel[]> {
    return (await this.orm)
      .getRepository(AutorisationSanitaireModel)
      .createQueryBuilder("autorisation_sanitaire")
      .leftJoinAndSelect("autorisation_sanitaire.établissementTerritorial", "établissementTerritorial")
      .where("établissementTerritorial.numero_finess_entite_juridique = :finess", { finess: numéroFinessEntitéJuridique })
      .getMany();
  }

  private async chargeLesAutresActivitesSanitaires(numéroFinessEntitéJuridique: string): Promise<AutreActivitéSanitaireModel[]> {
    return (await this.orm)
      .getRepository(AutreActivitéSanitaireModel)
      .createQueryBuilder("autre_activite_sanitaire")
      .leftJoinAndSelect("autre_activite_sanitaire.établissementTerritorial", "établissementTerritorial")
      .where("établissementTerritorial.numero_finess_entite_juridique = :finess", { finess: numéroFinessEntitéJuridique })
      .getMany();
  }

  private async chargeLesReconnaissanceContractuellesSanitaires(numéroFinessEntitéJuridique: string): Promise<ReconnaissanceContractuelleSanitaireModel[]> {
    return (await this.orm)
      .getRepository(ReconnaissanceContractuelleSanitaireModel)
      .createQueryBuilder("reconnaissance_contractuelle_sanitaire")
      .leftJoinAndSelect("reconnaissance_contractuelle_sanitaire.établissementTerritorial", "établissementTerritorial")
      .where("établissementTerritorial.numero_finess_entite_juridique = :finess", { finess: numéroFinessEntitéJuridique })
      .getMany();
  }

  private async chargeLesEquipementsMaterielLourdsSanitaire(numéroFinessEntitéJuridique: string): Promise<ÉquipementMatérielLourdSanitaireModel[]> {
    return (await this.orm)
      .getRepository(ÉquipementMatérielLourdSanitaireModel)
      .createQueryBuilder("equipement_materiel_lourd_sanitaire")
      .leftJoinAndSelect("equipement_materiel_lourd_sanitaire.établissementTerritorial", "établissementTerritorial")
      .where("établissementTerritorial.numero_finess_entite_juridique = :finess", { finess: numéroFinessEntitéJuridique })
      .getMany();
  }

  private async chargeLaDateDeMiseÀJourModel(fichierSource: FichierSource): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: fichierSource });
  }

  private async chargeLesCapacitésModel(numéroFinessEntitéJuridique: string): Promise<CapacitesSanitaireEntiteJuridiqueModel[]> {
    return await (await this.orm).getRepository(CapacitesSanitaireEntiteJuridiqueModel).find({ where: { numéroFinessEntitéJuridique } });
  }

  private construisLesCapacités(
    capacitésDeLÉntiteJuridiqueModel: CapacitesSanitaireEntiteJuridiqueModel[],
    dateDeMiseÀJourDiamantAnnSaeModel: DateMiseÀJourFichierSourceModel
  ): CapacitéSanitaireEntitéJuridique[] {
    return capacitésDeLÉntiteJuridiqueModel.map((capacités) => ({
      année: capacités.année,
      dateMiseÀJourSource: dateDeMiseÀJourDiamantAnnSaeModel.dernièreMiseÀJour,
      nombreDeLitsEnChirurgie: capacités.nombreDeLitsEnChirurgie,
      nombreDeLitsEnMédecine: capacités.nombreDeLitsEnMédecine,
      nombreDeLitsEnObstétrique: capacités.nombreDeLitsEnObstétrique,
      nombreDeLitsEnSsr: capacités.nombreDeLitsEnSsr,
      nombreDeLitsEnUsld: capacités.nombreDeLitsEnUsld,
      nombreDeLitsOuPlacesEnPsyHospitalisationComplète: capacités.nombreDeLitsOuPlacesEnPsyHospitalisationComplète,
      nombreDePlacesEnChirurgie: capacités.nombreDePlacesEnChirurgie,
      nombreDePlacesEnMédecine: capacités.nombreDePlacesEnMédecine,
      nombreDePlacesEnObstétrique: capacités.nombreDePlacesEnObstétrique,
      nombreDePlacesEnPsyHospitalisationPartielle: capacités.nombreDePlacesEnPsyHospitalisationPartielle,
      nombreDePlacesEnSsr: capacités.nombreDePlacesEnSsr,
    }));
  }
}

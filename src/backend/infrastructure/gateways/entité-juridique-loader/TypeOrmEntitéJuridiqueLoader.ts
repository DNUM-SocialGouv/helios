import { DataSource } from "typeorm";

import { ActivitéSanitaireEntitéJuridiqueModel } from "../../../../../database/models/ActivitéSanitaireEntitéJuridiqueModel";
import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { CatégorisationEnum, EntitéJuridiqueIdentité } from "../../../métier/entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "../../../métier/entities/entité-juridique/EntitéJuridiqueActivités";
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
}

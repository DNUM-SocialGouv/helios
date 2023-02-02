import { DataSource } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { EntitéJuridiqueModel } from "../../../../../database/models/EntitéJuridiqueModel";
import { EntitéJuridique } from "../../../métier/entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueNonTrouvée } from "../../../métier/entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueDeRattachement } from "../../../métier/entities/établissement-territorial-médico-social/EntitéJuridiqueDeRattachement";
import { EntitéJuridiqueLoader } from "../../../métier/gateways/EntitéJuridiqueLoader";

export class TypeOrmEntitéJuridiqueLoader implements EntitéJuridiqueLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeIdentité(numéroFiness: string): Promise<EntitéJuridique | EntitéJuridiqueNonTrouvée> {
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

  private construisLEntitéJuridique(
    entitéJuridiqueModel: EntitéJuridiqueModel,
    dateDeMiseAJourFichierSourceModel: DateMiseÀJourFichierSourceModel
  ): EntitéJuridique {
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
      catégorisation: entitéJuridiqueModel.catégorisation,
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

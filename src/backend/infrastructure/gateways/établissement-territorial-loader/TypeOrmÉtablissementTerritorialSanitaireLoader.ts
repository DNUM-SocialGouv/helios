import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialSanitaireActivité } from '../../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialSanitaireNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée'
import { ÉtablissementTerritorialSanitaireLoader } from '../../../métier/gateways/ÉtablissementTerritorialSanitaireLoader'

export class TypeOrmÉtablissementTerritorialSanitaireLoader implements ÉtablissementTerritorialSanitaireLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeActivité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialSanitaireActivité> {

  }

  async chargeIdentité(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialSanitaireNonTrouvée> {
    const établissementTerritorialModel = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({
        domaine: DomaineÉtablissementTerritorial.SANITAIRE,
        numéroFinessÉtablissementTerritorial: numéroFinessÉtablissementTerritorial,
      })
    if (!établissementTerritorialModel) {
      return new ÉtablissementTerritorialSanitaireNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construisLÉtablissementTerritorialSanitaire(établissementTerritorialModel, dateDeMiseAJourModel)
  }

  private async chargeLaDateDeMiseÀJourModel() {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private construisLÉtablissementTerritorialSanitaire(
    établissementTerritorialModel: ÉtablissementTerritorialIdentitéModel,
    dateDeMiseAJourModel: DateMiseÀJourSourceModel | null
  ): ÉtablissementTerritorialIdentité {
    return {
      adresseAcheminement: établissementTerritorialModel.adresseAcheminement,
      adresseNuméroVoie: établissementTerritorialModel.adresseNuméroVoie,
      adresseTypeVoie: établissementTerritorialModel.adresseTypeVoie,
      adresseVoie: établissementTerritorialModel.adresseVoie,
      catégorieÉtablissement: établissementTerritorialModel.catégorieÉtablissement,
      courriel: établissementTerritorialModel.courriel,
      dateMiseAJourSource: dateDeMiseAJourModel ? dateDeMiseAJourModel.dernièreMiseÀJour : '',
      libelléCatégorieÉtablissement: établissementTerritorialModel.libelléCatégorieÉtablissement,
      numéroFinessEntitéJuridique: établissementTerritorialModel.numéroFinessEntitéJuridique,
      numéroFinessÉtablissementPrincipal: établissementTerritorialModel.numéroFinessÉtablissementPrincipal,
      numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      raisonSociale: établissementTerritorialModel.raisonSociale,
      typeÉtablissement: établissementTerritorialModel.typeÉtablissement,
      téléphone: établissementTerritorialModel.téléphone,
    }
  }
}

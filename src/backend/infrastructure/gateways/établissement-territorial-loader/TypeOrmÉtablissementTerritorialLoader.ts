import { DataSource } from 'typeorm'

import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialNonTrouvée'
import { ÉtablissementTerritorialLoader } from '../../../métier/gateways/ÉtablissementTerritorialLoader'

export class TypeOrmÉtablissementTerritorialLoader implements ÉtablissementTerritorialLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeParNuméroFiness(numéroFinessET: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialNonTrouvée> {
    const établissementTerritorialModel = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({ numéroFinessÉtablissementTerritorial: numéroFinessET })

    if (!établissementTerritorialModel) {
      return new ÉtablissementTerritorialNonTrouvée(numéroFinessET)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construitLÉtablissementTerritorial(établissementTerritorialModel, dateDeMiseAJourModel)
  }

  private async chargeLaDateDeMiseÀJourModel() {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private construitLÉtablissementTerritorial(
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
      numéroFinessEntitéJuridique: établissementTerritorialModel.numéroFinessEntitéJuridique,
      numéroFinessÉtablissementPrincipal: établissementTerritorialModel.numéroFinessÉtablissementPrincipal,
      numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
      raisonSociale: établissementTerritorialModel.raisonSociale,
      typeÉtablissement: établissementTerritorialModel.typeÉtablissement,
      téléphone: établissementTerritorialModel.téléphone,
    }
  }
}

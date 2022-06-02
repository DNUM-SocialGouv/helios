import { DataSource } from 'typeorm'

import { DomaineÉtablissementTerritorial } from '../../../../data-crawler/métier/entities/DomaineÉtablissementTerritorial'
import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../../../../database/models/DateMiseÀJourSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { MonoÉtablissement } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocial/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../../../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader'

export class TypeOrmÉtablissementTerritorialMédicoSocialLoader implements ÉtablissementTerritorialMédicoSocialLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeParNuméroFiness(numéroFinessET: string): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée> {
    const établissementTerritorialModel = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOneBy({
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFinessÉtablissementTerritorial: numéroFinessET,
      })

    if (!établissementTerritorialModel) {
      return new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessET)
    }

    const dateDeMiseAJourModel = await this.chargeLaDateDeMiseÀJourModel()

    return this.construitLÉtablissementTerritorialMédicoSocial(établissementTerritorialModel, dateDeMiseAJourModel)
  }

  async estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement> {
    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .countBy({ numéroFinessEntitéJuridique: numéroFinessEntitéJuridique })

    return { estMonoÉtablissement: nombreDÉtablissementTerritoriauxDansLEntitéJuridique === 1 }
  }

  private async chargeLaDateDeMiseÀJourModel() {
    return await (await this.orm)
      .getRepository(DateMiseÀJourSourceModel)
      .findOneBy({ source: SourceDeDonnées.FINESS })
  }

  private construitLÉtablissementTerritorialMédicoSocial(
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

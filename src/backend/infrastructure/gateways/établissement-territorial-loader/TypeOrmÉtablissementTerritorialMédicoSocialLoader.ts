import { DataSource } from 'typeorm'

import { ActivitéMédicoSocialModel } from '../../../../../database/models/ActivitéMédicoSocialModel'
import { AutorisationMédicoSocialModel } from '../../../../../database/models/AutorisationMédicoSocialModel'
import { DateMiseÀJourFichierSourceModel, FichierSource } from '../../../../../database/models/DateMiseÀJourFichierSourceModel'
import { ÉtablissementTerritorialIdentitéModel } from '../../../../../database/models/ÉtablissementTerritorialIdentitéModel'
import { DomaineÉtablissementTerritorial } from '../../../métier/entities/DomaineÉtablissementTerritorial'
import { MonoÉtablissement } from '../../../métier/entities/établissement-territorial-médico-social/MonoÉtablissement'
import { ÉtablissementTerritorialMédicoSocialActivité } from '../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { AutorisationMédicoSocialActivité, AutorisationMédicoSocialClientèle, AutorisationMédicoSocialDatesEtCapacités, AutorisationMédicoSocialDiscipline, ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from '../../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation'
import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from '../../../métier/entities/ÉtablissementTerritorialMédicoSocialNonTrouvée'
import { ÉtablissementTerritorialMédicoSocialLoader } from '../../../métier/gateways/ÉtablissementTerritorialMédicoSocialLoader'

export class TypeOrmÉtablissementTerritorialMédicoSocialLoader implements ÉtablissementTerritorialMédicoSocialLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeActivité(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialMédicoSocialActivité[]> {
    const activitésÉtablissementTerritorialActivitésModel = await this.chargeLesActivitésModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseÀJourAnnMsTdpEtModel = await this.chargeLaDateDeMiseÀJourAnnMsTdpEtModel() as DateMiseÀJourFichierSourceModel
    const dateDeMiseÀJourAnnErrdEjEtModel = await this.chargeLaDateDeMiseÀJourAnnErrdEjEtModel() as DateMiseÀJourFichierSourceModel

    return this.construisActivité(
      activitésÉtablissementTerritorialActivitésModel,
      dateDeMiseÀJourAnnMsTdpEtModel,
      dateDeMiseÀJourAnnErrdEjEtModel
    )
  }

  async chargeIdentité(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialIdentité | ÉtablissementTerritorialMédicoSocialNonTrouvée> {
    const établissementTerritorialIdentitéModel = await this.chargeLIdentitéModel(numéroFinessÉtablissementTerritorial)

    if (!établissementTerritorialIdentitéModel) {
      return new ÉtablissementTerritorialMédicoSocialNonTrouvée(numéroFinessÉtablissementTerritorial)
    }

    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourFinessCs1400102Model() as DateMiseÀJourFichierSourceModel
    const dateDeMiseÀJourAnnMsTdpEtModel = await this.chargeLaDateDeMiseÀJourAnnMsTdpEtModel() as DateMiseÀJourFichierSourceModel

    return this.construisIdentité(établissementTerritorialIdentitéModel, dateDeMiseÀJourIdentitéModel, dateDeMiseÀJourAnnMsTdpEtModel)
  }

  async chargeAutorisationsEtCapacités(
    numéroFinessÉtablissementTerritorial: string
  ): Promise<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité> {
    const autorisationsDeLÉtablissementModel = await this.chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial)
    const dateDeMiseÀJourFinessCs1400105Model = await this.chargeLaDateDeMiseÀJourFinessCs1400105Model() as DateMiseÀJourFichierSourceModel

    return {
      autorisations: this.construisLesAutorisations(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400105Model),
      capacités: this.construisLesCapacités(autorisationsDeLÉtablissementModel, dateDeMiseÀJourFinessCs1400105Model),
      numéroFinessÉtablissementTerritorial,
    }
  }

  async estUnMonoÉtablissement(numéroFinessEntitéJuridique: string): Promise<MonoÉtablissement> {
    const nombreDÉtablissementTerritoriauxDansLEntitéJuridique = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .countBy({ numéroFinessEntitéJuridique })
    const dateDeMiseÀJourIdentitéModel = await this.chargeLaDateDeMiseÀJourFinessCs1400102Model() as DateMiseÀJourFichierSourceModel

    return {
      estMonoÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: nombreDÉtablissementTerritoriauxDansLEntitéJuridique === 1,
      },
    }
  }

  private async chargeLesActivitésModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(ActivitéMédicoSocialModel)
      .find({
        order: { année: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLIdentitéModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .findOne({
        relations: { cpom: true },
        where: {
          domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
          numéroFinessÉtablissementTerritorial,
        },
      })
  }

  private async chargeLesAutorisationsModel(numéroFinessÉtablissementTerritorial: string) {
    return await (await this.orm)
      .getRepository(AutorisationMédicoSocialModel)
      .find({
        order: { disciplineDÉquipement: 'ASC' },
        where: { numéroFinessÉtablissementTerritorial },
      })
  }

  private async chargeLaDateDeMiseÀJourFinessCs1400102Model(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.FINESS_CS1400102 })
  }

  private async chargeLaDateDeMiseÀJourFinessCs1400105Model(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.FINESS_CS1400105 })
  }

  private async chargeLaDateDeMiseÀJourAnnMsTdpEtModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_ANN_MS_TDP_ET })
  }

  private async chargeLaDateDeMiseÀJourAnnErrdEjEtModel(): Promise<DateMiseÀJourFichierSourceModel | null> {
    return await (await this.orm)
      .getRepository(DateMiseÀJourFichierSourceModel)
      .findOneBy({ fichier: FichierSource.DIAMANT_ANN_ERRD_EJ_ET })
  }

  private construisIdentité(
    établissementTerritorialIdentitéModel: ÉtablissementTerritorialIdentitéModel,
    dateDeMiseÀJourIdentitéModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseÀJourAnnMsTdpEtModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialIdentité {
    return {
      adresseAcheminement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseAcheminement,
      },
      adresseNuméroVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseNuméroVoie,
      },
      adresseTypeVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseTypeVoie,
      },
      adresseVoie: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.adresseVoie,
      },
      catégorieÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.catégorieÉtablissement,
      },
      courriel: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.courriel,
      },
      dateDEntréeEnVigueurDuCpom: {
        dateMiseÀJourSource: dateDeMiseÀJourAnnMsTdpEtModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.cpom.dateDEntréeEnVigueur,
      },
      libelléCatégorieÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.libelléCatégorieÉtablissement,
      },
      numéroFinessEntitéJuridique: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessEntitéJuridique,
      },
      numéroFinessÉtablissementPrincipal: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementPrincipal,
      },
      numéroFinessÉtablissementTerritorial: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.numéroFinessÉtablissementTerritorial,
      },
      raisonSociale: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.raisonSociale,
      },
      typeÉtablissement: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.typeÉtablissement,
      },
      téléphone: {
        dateMiseÀJourSource: dateDeMiseÀJourIdentitéModel.dernièreMiseÀJour,
        value: établissementTerritorialIdentitéModel.téléphone,
      },
    }
  }

  private construisActivité(
    établissementTerritorialActivitésModel: ActivitéMédicoSocialModel[],
    dateDeMiseAJourAnnMsTdpEtModel: DateMiseÀJourFichierSourceModel,
    dateDeMiseAJourAnnErrdEjEtModel: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialActivité[] {
    return établissementTerritorialActivitésModel.map<ÉtablissementTerritorialMédicoSocialActivité>((établissementTerritorialModel) =>
      ({
        année: établissementTerritorialModel.année,
        duréeMoyenneSéjourAccompagnementPersonnesSorties: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.duréeMoyenneSéjourAccompagnementPersonnesSorties,
        },
        fileActivePersonnesAccompagnées: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.fileActivePersonnesAccompagnées,
        },
        nombreMoyenJournéesAbsencePersonnesAccompagnées: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.nombreMoyenJournéesAbsencePersonnesAccompagnées,
        },
        numéroFinessÉtablissementTerritorial: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
        tauxOccupationAccueilDeJour: {
          dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationAccueilDeJour,
        },
        tauxOccupationHébergementPermanent: {
          dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationHébergementPermanent,
        },
        tauxOccupationHébergementTemporaire: {
          dateMiseÀJourSource: dateDeMiseAJourAnnErrdEjEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxOccupationHébergementTemporaire,
        },
        tauxRéalisationActivité: {
          dateMiseÀJourSource: dateDeMiseAJourAnnMsTdpEtModel.dernièreMiseÀJour,
          value: établissementTerritorialModel.tauxRéalisationActivité,
        },
      }))
  }

  private construisLesAutorisations(
    autorisationsModel: AutorisationMédicoSocialModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité['autorisations'] {
    const disciplinesDeLÉtablissement: AutorisationMédicoSocialDiscipline[] = []

    autorisationsModel.forEach((autorisationModel: AutorisationMédicoSocialModel) => {
      const codeDiscipline = autorisationModel.disciplineDÉquipement
      const codeActivité = autorisationModel.activité
      const codeClientèle = autorisationModel.clientèle

      const disciplineCréée = disciplinesDeLÉtablissement.find((discipline) => discipline.code === codeDiscipline)

      if (!disciplineCréée) {
        disciplinesDeLÉtablissement.push(this.construisLaDisciplineDUneAutorisation(autorisationModel))
      } else {
        const activitéCréée = disciplineCréée.activités.find((activité) => activité.code === codeActivité)

        if (!activitéCréée) {
          disciplineCréée.activités.push(this.construisLActivitéDUneAutorisation(autorisationModel))
        } else {
          const clientèleCréée = activitéCréée.clientèles.find((clientèle) => clientèle.code === codeClientèle)

          if (!clientèleCréée) {
            activitéCréée.clientèles.push(this.construisLaClientèleDUneAutorisation(autorisationModel))
          }
        }
      }
    })

    return {
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
      disciplines: disciplinesDeLÉtablissement,
    }
  }

  private construisLesCapacités(
    autorisationsModel: AutorisationMédicoSocialModel[],
    dateMiseÀJourSource: DateMiseÀJourFichierSourceModel
  ): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité['capacités'] {
    const capacitéParActivité = autorisationsModel.reduce((activités: { capacité: number, libellé: string }[], autorisation: AutorisationMédicoSocialModel) => {
      if (!autorisation.capacitéInstalléeTotale) return activités
      if (autorisation.estInstallée) {
        const activité = activités.find((capacitéParActivité) => capacitéParActivité.libellé === autorisation.libelléActivité)

        if (!activité) {
          activités.push({
            capacité: autorisation.capacitéInstalléeTotale,
            libellé: autorisation.libelléActivité,
          })
        } else {
          activité.capacité += autorisation.capacitéInstalléeTotale
        }
      }
      return activités
    }, []).sort((a, b) => a.libellé.localeCompare(b.libellé))

    return {
      capacitéParActivité,
      dateMiseÀJourSource: dateMiseÀJourSource.dernièreMiseÀJour,
    }
  }

  private construisLaDisciplineDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialDiscipline {
    return {
      activités: [this.construisLActivitéDUneAutorisation(autorisationModel)],
      code: autorisationModel.disciplineDÉquipement,
      libellé: autorisationModel.libelléDisciplineDÉquipement,
    }
  }

  private construisLActivitéDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialActivité {
    return {
      clientèles: [this.construisLaClientèleDUneAutorisation(autorisationModel)],
      code: autorisationModel.activité,
      libellé: autorisationModel.libelléActivité,
    }
  }

  private construisLaClientèleDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialClientèle {
    return {
      code: autorisationModel.clientèle,
      datesEtCapacités: this.construisLesDatesEtCapacitésDUneAutorisation(autorisationModel),
      libellé: autorisationModel.libelléClientèle,
    }
  }

  private construisLesDatesEtCapacitésDUneAutorisation(autorisationModel: AutorisationMédicoSocialModel): AutorisationMédicoSocialDatesEtCapacités {
    return {
      capacitéAutoriséeTotale: autorisationModel.capacitéAutoriséeTotale,
      capacitéInstalléeTotale: autorisationModel.capacitéInstalléeTotale,
      dateDAutorisation: autorisationModel.dateDAutorisation,
      dateDeDernièreInstallation: autorisationModel.dateDeDernièreInstallation,
      dateDeMiseÀJourDAutorisation: autorisationModel.dateDeMiseÀJourDAutorisation,
      estInstallée: autorisationModel.estInstallée,
    }
  }
}

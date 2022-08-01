import { EntitéJuridique } from '../métier/entities/entité-juridique/EntitéJuridique'

export class EntitéJuridiqueTestBuilder {
  private static entitéJurique: EntitéJuridique = {
    adresseAcheminement: {
      dateMiseAJourSource: '2022-05-14',
      value: '01117 OYONNAX CEDEX',
    },
    adresseNuméroVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: '1',
    },
    adresseTypeVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: 'RTE',
    },
    adresseVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: 'DE VEYZIAT',
    },
    dateMiseAJourSource: '2022-05-14',
    libelléStatutJuridique: {
      dateMiseAJourSource: '2022-05-14',
      value: 'Etablissement Public Intercommunal dHospitalisation',
    },
    numéroFinessEntitéJuridique: {
      dateMiseAJourSource: '2022-05-14',
      value: '010018407',
    },
    raisonSociale: {
      dateMiseAJourSource: '2022-05-14',
      value: 'CENTRE HOSPITALIER DU HAUT BUGEY',
    },
    téléphone: {
      dateMiseAJourSource: '2022-05-14',
      value: '0102030406',
    },
  }

  public static créeEntitéJuridique(champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridique {
    return {
      ...EntitéJuridiqueTestBuilder.entitéJurique,
      ...champsSurchargés,
    }
  }
}

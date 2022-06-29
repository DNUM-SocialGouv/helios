import { EntitéJuridique } from '../métier/entities/entité-juridique/EntitéJuridique'

export class EntitéJuridiqueTestBuilder {
  private static entitéJurique: EntitéJuridique = {
    adresseAcheminement: '01117 OYONNAX CEDEX',
    adresseNuméroVoie: '1',
    adresseTypeVoie: 'RTE',
    adresseVoie: 'DE VEYZIAT',
    dateMiseAJourSource: '2022-05-14',
    libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
    numéroFinessEntitéJuridique: '010018407',
    raisonSociale: 'CH DU HAUT BUGEY',
    téléphone: '0102030406',
  }

  public static créeEntitéJuridique(champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridique {
    return {
      ...EntitéJuridiqueTestBuilder.entitéJurique,
      ...champsSurchargés,
    }
  }
}

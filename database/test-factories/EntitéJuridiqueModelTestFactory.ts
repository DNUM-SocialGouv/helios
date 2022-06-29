import { EntitéJuridiqueModel } from '../models/EntitéJuridiqueModel'

export class EntitéJuridiqueModelTestFactory {
  public static crée(champsSurchargés?: Partial<EntitéJuridiqueModel>): EntitéJuridiqueModel {
    const entitéJuridique = new EntitéJuridiqueModel()
    entitéJuridique.adresseAcheminement = champsSurchargés?.adresseAcheminement || '01117 OYONNAX CEDEX'
    entitéJuridique.adresseNuméroVoie = champsSurchargés?.adresseNuméroVoie || '1'
    entitéJuridique.adresseTypeVoie = champsSurchargés?.adresseTypeVoie || 'RTE'
    entitéJuridique.adresseVoie = champsSurchargés?.adresseVoie || 'DE VEYZIAT'
    entitéJuridique.libelléStatutJuridique = champsSurchargés?.libelléStatutJuridique || 'Etablissement Public Intercommunal dHospitalisation'
    entitéJuridique.numéroFinessEntitéJuridique = champsSurchargés?.numéroFinessEntitéJuridique || '010018407'
    entitéJuridique.raisonSociale = champsSurchargés?.raisonSociale || 'CH DU HAUT BUGEY'
    entitéJuridique.téléphone = champsSurchargés?.téléphone || '0102030406'
    return entitéJuridique
  }
}

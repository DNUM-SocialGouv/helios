import { DomaineÉtablissementTerritorial } from '../../datacrawler/legacy/métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialIdentitéModel } from '../models/ÉtablissementTerritorialIdentitéModel'

export class ÉtablissementTerritorialIdentitéModelTestBuilder {
  public static créeMédicoSocial(
    champsSurchargés?: Partial<ÉtablissementTerritorialIdentitéModel>
  ): ÉtablissementTerritorialIdentitéModel {
    const établissementTerritorialModel = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorialModel.adresseAcheminement = champsSurchargés?.adresseAcheminement || '01130 NANTUA'
    établissementTerritorialModel.adresseNuméroVoie = champsSurchargés?.adresseNuméroVoie || '50'
    établissementTerritorialModel.adresseTypeVoie = champsSurchargés?.adresseTypeVoie || 'R'
    établissementTerritorialModel.adresseVoie = champsSurchargés?.adresseVoie || 'PAUL PAINLEVE'
    établissementTerritorialModel.catégorieÉtablissement = champsSurchargés?.catégorieÉtablissement || '159'
    établissementTerritorialModel.commune = champsSurchargés?.commune || 'NANTUA'
    établissementTerritorialModel.courriel = champsSurchargés?.courriel || 'a@example.com'
    établissementTerritorialModel.domaine = champsSurchargés?.domaine || DomaineÉtablissementTerritorial.MÉDICO_SOCIAL
    établissementTerritorialModel.département = champsSurchargés?.département || 'AIN'
    établissementTerritorialModel.libelléCatégorieÉtablissement = champsSurchargés?.libelléCatégorieÉtablissement || 'Centre Hospitalier (C.H.)'
    établissementTerritorialModel.libelléCourtCatégorieÉtablissement = champsSurchargés?.libelléCourtCatégorieÉtablissement || 'C.H.'
    établissementTerritorialModel.numéroFinessEntitéJuridique = champsSurchargés?.numéroFinessEntitéJuridique || '010008407'
    établissementTerritorialModel.numéroFinessÉtablissementPrincipal = champsSurchargés?.numéroFinessÉtablissementPrincipal || '010018407'
    établissementTerritorialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '010000040'
    établissementTerritorialModel.raisonSociale = champsSurchargés?.raisonSociale || 'CENTRE HOSPITALIER NANTUA'
    établissementTerritorialModel.raisonSocialeCourte = champsSurchargés?.raisonSocialeCourte || 'CH NANTUA'
    établissementTerritorialModel.téléphone = champsSurchargés?.téléphone || '0102030405'
    établissementTerritorialModel.typeÉtablissement = champsSurchargés?.typeÉtablissement || 'S'
    return établissementTerritorialModel
  }

  public static créeSanitaire(
    champsSurchargés?: Partial<ÉtablissementTerritorialIdentitéModel>
  ): ÉtablissementTerritorialIdentitéModel {
    const établissementTerritorialModel = new ÉtablissementTerritorialIdentitéModel()
    établissementTerritorialModel.adresseAcheminement = champsSurchargés?.adresseAcheminement || '59650 VILLENEUVE D ASCQ'
    établissementTerritorialModel.adresseNuméroVoie = champsSurchargés?.adresseNuméroVoie || '20'
    établissementTerritorialModel.adresseTypeVoie = champsSurchargés?.adresseTypeVoie || 'AV'
    établissementTerritorialModel.adresseVoie = champsSurchargés?.adresseVoie || 'DE LA RECONNAISSANCE'
    établissementTerritorialModel.catégorieÉtablissement = champsSurchargés?.catégorieÉtablissement || '365'
    établissementTerritorialModel.commune = champsSurchargés?.commune || 'VILLENEUVE D ASCQ'
    établissementTerritorialModel.courriel = champsSurchargés?.courriel || 'b@example.com'
    établissementTerritorialModel.domaine = champsSurchargés?.domaine || DomaineÉtablissementTerritorial.SANITAIRE
    établissementTerritorialModel.département = champsSurchargés?.département || 'NORD'
    établissementTerritorialModel.libelléCatégorieÉtablissement = champsSurchargés?.libelléCatégorieÉtablissement || 'Centre Hospitalier (C.H.)'
    établissementTerritorialModel.libelléCourtCatégorieÉtablissement = champsSurchargés?.libelléCourtCatégorieÉtablissement || 'C.H.'
    établissementTerritorialModel.numéroFinessEntitéJuridique = champsSurchargés?.numéroFinessEntitéJuridique || '590000741'
    établissementTerritorialModel.numéroFinessÉtablissementPrincipal = champsSurchargés?.numéroFinessÉtablissementPrincipal || ''
    établissementTerritorialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '590782553'
    établissementTerritorialModel.raisonSociale = champsSurchargés?.raisonSociale || 'HOPITAL PRIVE DE VILLENEUVE DASCQ'
    établissementTerritorialModel.raisonSocialeCourte = champsSurchargés?.raisonSocialeCourte || 'HOPITAL PRIVE DE VILLENEUVE DASCQ'
    établissementTerritorialModel.téléphone = champsSurchargés?.téléphone || '0102030406'
    établissementTerritorialModel.typeÉtablissement = champsSurchargés?.typeÉtablissement || 'P'
    return établissementTerritorialModel
  }
}

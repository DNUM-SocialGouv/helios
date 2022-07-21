import { Résultat } from '../métier/entities/RésultatDeRecherche'

export class RésultatDeRechercheTestBuilder {
  private static résultatDeRechercheEntité: Résultat = {
    commune: '',
    département: '',
    numéroFiness: '010018407',
    raisonSociale: 'CH DU HAUT BUGEY',
    type: 'Entité juridique',
  }
  private static résultatDeRechercheÉtablissementMédicoSocial: Résultat = {
    commune: '',
    département: '',
    numéroFiness: '010000040',
    raisonSociale: 'CH NANTUA',
    type: 'Médico-social',
  }
  private static résultatDeRechercheÉtablissementSanitaire: Résultat = {
    commune: '',
    département: '',
    numéroFiness: '590782553',
    raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    type: 'Sanitaire',
  }

  public static créeUnRésultatDeRechercheEntité(champsSurchargés?: Partial<Résultat>): Résultat {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheEntité,
      ...champsSurchargés,
    }
  }

  public static créeUnRésultatDeRechercheÉtablissementMédicoSocial(champsSurchargés?: Partial<Résultat>): Résultat {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheÉtablissementMédicoSocial,
      ...champsSurchargés,
    }
  }

  public static créeUnRésultatDeRechercheÉtablissementSanitaire(champsSurchargés?: Partial<Résultat>): Résultat {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheÉtablissementSanitaire,
      ...champsSurchargés,
    }
  }
}

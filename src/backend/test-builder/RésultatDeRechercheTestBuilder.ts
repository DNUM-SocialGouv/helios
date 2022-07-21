import { RésultatDeRecherche } from '../métier/entities/RésultatDeRecherche'

export class RésultatDeRechercheTestBuilder {
  private static résultatDeRechercheEntité: RésultatDeRecherche = {
    domaine: 'Entité juridique',
    numéroFiness: '010018407',
    raisonSociale: 'CH DU HAUT BUGEY',
  }
  private static résultatDeRechercheÉtablissementMédicoSocial: RésultatDeRecherche = {
    domaine: 'Médico-social',
    numéroFiness: '010000040',
    raisonSociale: 'CH NANTUA',
  }
  private static résultatDeRechercheÉtablissementSanitaire: RésultatDeRecherche = {
    domaine: 'Sanitaire',
    numéroFiness: '590782553',
    raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
  }

  public static créeUnRésultatDeRechercheEntité(champsSurchargés?: Partial<RésultatDeRecherche>): RésultatDeRecherche {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheEntité,
      ...champsSurchargés,
    }
  }

  public static créeUnRésultatDeRechercheÉtablissementMédicoSocial(champsSurchargés?: Partial<RésultatDeRecherche>): RésultatDeRecherche {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheÉtablissementMédicoSocial,
      ...champsSurchargés,
    }
  }

  public static créeUnRésultatDeRechercheÉtablissementSanitaire(champsSurchargés?: Partial<RésultatDeRecherche>): RésultatDeRecherche {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheÉtablissementSanitaire,
      ...champsSurchargés,
    }
  }
}

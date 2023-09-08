import { ÉtablissementTerritorialMédicoSocial } from "../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialUseCase";
import { filterEtablissementMedicoSocial } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string
): Promise<ÉtablissementTerritorialMédicoSocial> {
  const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
    dependencies.établissementTerritorialMédicoSocialLoader,
    dependencies.entitéJuridiqueLoader
  );

  const profilMédicoSocial = {
    'identité': {
      'habilité': 'ok',
      'nom': 'ok',
      'numéroFiness': 'ok',
      'siret': 'ok',
      'adresse': 'ok',
      'télEtEmail': 'ok',
      'EJ_rattachement': 'ok',
      'catégorieÉtablissement': 'ok',
      'modeTarification': 'ok',
      'statut_EJ': 'ok',
      'mono_établissement': 'ok',
      'ET_principal_secondaire': 'ok',
      'dateDEntréeEnVigueurDuCpom': 'no'
    },
    'autorisationsEtCapacités': {
      'habilité': 'ok',
      'capacités': 'ok',
      'autorisations': 'no',
    },
    'activités': {
      'habilité': 'ok',
      'duréeMoyenneSéjourAccompagnementPersonnesSorties': 'no',
      'fileActivePersonnesAccompagnées': 'no',
      'nombreMoyenJournéesAbsencePersonnesAccompagnées': 'no',
      'tauxOccupationAccueilDeJour': 'ok',
      'tauxOccupationHébergementPermanent': 'ok',
      'tauxOccupationHébergementTemporaire': 'ok',
      'tauxRéalisationActivité': 'no'
    },
    'ressourcesHumaines': {
      'habilité': 'ok',
      'nombreDEtpRéalisés': 'ok',
      'nombreDeCddDeRemplacement': 'ok',
      'tauxDAbsentéisme': 'nofilterEtablissementMedicoSocial',
      'tauxDEtpVacants': 'no',
      'tauxDePrestationsExternes': 'no',
      'tauxDeRotationDuPersonnel': 'no'
    },
    'budgetEtFinances': {
      'habilité': 'ok',
      'compteRésultats': 'ok',
      'contributionAuxFraisDeSiège': 'ok',
      'fondsDeRoulement': 'ok',
      'résultatNetComptable': 'ok',
      'tauxDeCafNette': 'ok',
      'tauxDeVétustéConstruction': 'ok'
    },
    'Qualité': {
      'habilité': 'ok',
      'nombre_reclamation': 'ok',
      'nombre_reclamation_motif': 'ok',
      'missions': 'ok',
      'vignette': 'ok',
      'nombre_EIAS/EIGS': 'ok',
      'nombre_incident_encours': 'ok',
      'nombre_incident_cloturé': 'ok'
    }
  }

  const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(
    numéroFinessÉtablissementTerritorialMédicoSocial
  );
  return filterEtablissementMedicoSocial(établissementTerritorialMédicoSocial, profilMédicoSocial);
}

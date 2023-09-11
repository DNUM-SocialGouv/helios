import { ÉtablissementTerritorialSanitaire } from "../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase";
import { filterEtablissementSanitaire } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string
): Promise<ÉtablissementTerritorialSanitaire> {
  const récupèreLÉtablissementTerritorialSanitaireUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
    dependencies.établissementTerritorialSanitaireLoader,
    dependencies.entitéJuridiqueLoader
  );

  const profilETSanitaire = {
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
    },
    'autorisationsEtCapacités': {
      'habilité': 'ok',
      'capacités': 'no',
      'autorisationsActivités': 'no',
      'autresActivités': 'no',
      'reconnaissanceContractuelleActivités': 'no',
      'equipementMaterielLourdsActivités': 'no',
    },
    'activités': {
      'habilité': 'ok',
      'nombreSéjours': 'ok',
      'nombreJournées': 'ok',
      'nombrePassage': 'ok',
    },
    'Qualité': {
      'habilité': 'ok',
      'nombre_reclamation': 'ok',
      'nombre_reclamation_motif': 'ok',
      'missions': 'ok',
      'vignette': 'ok',
      'nombre_EIAS/EIGS_encours': 'ok',
      'nombre_EIAS/EIGS_cloturé': 'ok',
      'nombre_incident_encours': 'ok',
      'nombre_incident_cloturé': 'ok'
    }
  }

  const etablissementSanitaire = await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire);

  return filterEtablissementSanitaire(etablissementSanitaire, profilETSanitaire);
}

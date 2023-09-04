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
      'nom': 'no',
      'numéroFiness': 'no',
      'siret': 'no',
      'adresse': 'no',
      'télEtEmail': 'no',
      'EJ_rattachement': 'no',
      'catégorieÉtablissement': 'no',
      'modeTarification': 'no',
      'statut_EJ': 'no',
    },
    'autorisationsEtCapacités': {
      'habilité': 'ok',
      'capacités': 'no',
      'autorisationsActivités': 'ok',
      'autresActivités': 'no',
      'reconnaissanceContractuelleActivités': 'ok',
      'equipementMaterielLourdsActivités': 'no',
    },
    'activités': {
      'habilité': 'ok',
      'nombreSéjours': 'no',
      'nombreJournées': 'no',
      'nombrePassage': 'no',
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

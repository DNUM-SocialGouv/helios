import { ProfilModel } from "../../../../database/models/ProfilModel";
import appCache from "../../cacheProvider";
import { ÉtablissementTerritorialSanitaire } from "../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase";
import { filterEtablissementSanitaire } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string,
  codeRegion: string,
): Promise<ÉtablissementTerritorialSanitaire> {
  const récupèreLÉtablissementTerritorialSanitaireUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
    dependencies.établissementTerritorialSanitaireLoader,
    dependencies.entitéJuridiqueLoader
  );

  const etablissementSanitaire = await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire);
  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profilInCache = appCache.get("userProfile") as ProfilModel;
  let profil: ProfilModel | null;
  if (profilInCache === undefined) {
    profil = await loginUseCase.getProfile();
    appCache.set("userProfile", profil, 3600);
  } else {
    profil = profilInCache;
  }

  const profilETSanitaire = etablissementSanitaire.identité.codeRegion === codeRegion ? profil?.value.institution.profilETSanitaire : profil?.value.autreRegion.profilETSanitaire;

  return filterEtablissementSanitaire(etablissementSanitaire, profilETSanitaire);
}

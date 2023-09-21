import { ProfilModel } from "../../../../database/models/ProfilModel";
import appCache from "../../cacheProvider";
import { ÉtablissementTerritorialSanitaire } from "../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase";
import { combineProfils, filterEtablissementSanitaire } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string,
  codeRegion: string,
  codeProfiles: string[]
): Promise<ÉtablissementTerritorialSanitaire> {
  const récupèreLÉtablissementTerritorialSanitaireUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
    dependencies.établissementTerritorialSanitaireLoader,
    dependencies.entitéJuridiqueLoader
  );

  const etablissementSanitaire = await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire);

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profilInCache = appCache.get("userProfile") as object;
  let profil: object;

  if (profilInCache === undefined) {
    const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
    const profilesValues = profiles.map((profile) => etablissementSanitaire.identité.codeRegion === codeRegion ? profile?.value.institution.profilETSanitaire : profile?.value.autreRegion.profilETSanitaire)
    profil = combineProfils(profilesValues);
    appCache.set("userProfile", profil, 3600);
  } else {
    profil = profilInCache;
  }


  return filterEtablissementSanitaire(etablissementSanitaire, profil);
}

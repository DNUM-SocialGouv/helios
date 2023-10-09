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
  const profileInstitutionInCache = appCache.get("userInstETSanProfile") as object;
  const profileAutreRegInCache = appCache.get("userAutreRegETSanProfile") as object;

  let profilInstitution: object;
  let profilAutreReg: object;

  if (!profileInstitutionInCache || !profileAutreRegInCache) {
    const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
    const profilesInstitutionValues = profiles.map((profile) => profile?.value.institution.profilETSanitaire)
    const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilETSanitaire)

    profilInstitution = combineProfils(profilesInstitutionValues);
    profilAutreReg = combineProfils(profilesAutreRegValues);

    appCache.set("userInstETSanProfile", profilInstitution, 3600);
    appCache.set("userAutreRegETSanProfile", profilAutreReg, 3600);

  } else {
    profilInstitution = profileInstitutionInCache;
    profilAutreReg = profileAutreRegInCache;
  }


  return filterEtablissementSanitaire(etablissementSanitaire, etablissementSanitaire.identité.codeRegion === codeRegion ? profilInstitution : profilAutreReg);
}

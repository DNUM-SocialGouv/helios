import { ProfilModel } from "../../../../database/models/ProfilModel";
import appCache from "../../cacheProvider";
import { ÉtablissementTerritorialMédicoSocial } from "../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialUseCase";
import { combineProfils, filterEtablissementMedicoSocial } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string,
  codeRegion: string,
  codeProfiles: string[]
): Promise<ÉtablissementTerritorialMédicoSocial> {
  const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
    dependencies.établissementTerritorialMédicoSocialLoader,
    dependencies.entitéJuridiqueLoader
  );

  const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(
    numéroFinessÉtablissementTerritorialMédicoSocial
  );

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profileInstitutionInCache = appCache.get("userInstETMSProfile") as object;
  const profileAutreRegInCache = appCache.get("userAutreRegETMSProfile") as object;

  let profilInstitution: object;
  let profilAutreReg: object;

  if (!profileInstitutionInCache || !profileAutreRegInCache) {
    const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
    const profilesInstitutionValues = profiles.map((profile) => profile?.value.institution.profilMédicoSocial)
    const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilMédicoSocial)

    profilInstitution = combineProfils(profilesInstitutionValues);
    profilAutreReg = combineProfils(profilesAutreRegValues);

    appCache.set("userInstETMSProfile", profilInstitution, 3600);
    appCache.set("userAutreRegETMSProfile", profilAutreReg, 3600);

  } else {
    profilInstitution = profileInstitutionInCache;
    profilAutreReg = profileAutreRegInCache;
  }

  return filterEtablissementMedicoSocial(établissementTerritorialMédicoSocial, établissementTerritorialMédicoSocial.identité.codeRegion === codeRegion ? profilInstitution : profilAutreReg);
}

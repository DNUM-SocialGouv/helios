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

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profilInCache = appCache.get("userProfile") as object;
  let profil: object;

  const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(
    numéroFinessÉtablissementTerritorialMédicoSocial
  );

  if (profilInCache === undefined) {
    const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
    const profilesValues = profiles.map((profile) => établissementTerritorialMédicoSocial.identité.codeRegion === codeRegion ? profile?.value.institution.profilMédicoSocial : profile?.value.autreRegion.profilMédicoSocial)
    profil = combineProfils(profilesValues);
    appCache.set("userProfile", profil, 3600);
  } else {
    profil = profilInCache;
  }

  return filterEtablissementMedicoSocial(établissementTerritorialMédicoSocial, profil);
}

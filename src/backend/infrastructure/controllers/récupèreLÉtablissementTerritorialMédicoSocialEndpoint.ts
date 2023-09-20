import { ProfilModel } from "../../../../database/models/ProfilModel";
import appCache from "../../cacheProvider";
import { ÉtablissementTerritorialMédicoSocial } from "../../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLÉtablissementTerritorialMédicoSocialUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialMédicoSocialUseCase";
import { filterEtablissementMedicoSocial } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialMédicoSocialEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialMédicoSocial: string,
  codeRegion: string
): Promise<ÉtablissementTerritorialMédicoSocial> {
  const récupèreLÉtablissementTerritorialMédicoSocialUseCase = new RécupèreLÉtablissementTerritorialMédicoSocialUseCase(
    dependencies.établissementTerritorialMédicoSocialLoader,
    dependencies.entitéJuridiqueLoader
  );

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profilInCache = appCache.get("userProfile") as ProfilModel;
  let profil: ProfilModel | null;

  if (profilInCache === undefined) {
    profil = await loginUseCase.getProfile();
    appCache.set("userProfile", profil, 3600);
  } else {
    profil = profilInCache;
  }

  const établissementTerritorialMédicoSocial = await récupèreLÉtablissementTerritorialMédicoSocialUseCase.exécute(
    numéroFinessÉtablissementTerritorialMédicoSocial
  );

  const profilMédicoSocial = établissementTerritorialMédicoSocial.identité.codeRegion === codeRegion ? profil?.value.institution.profilMédicoSocial : profil?.value.autreRegion.profilMédicoSocial;

  return filterEtablissementMedicoSocial(établissementTerritorialMédicoSocial, profilMédicoSocial);
}

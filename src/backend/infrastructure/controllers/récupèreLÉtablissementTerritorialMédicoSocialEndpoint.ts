import { ProfilModel } from "../../../../database/models/ProfilModel";
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

  const profiles = (await loginUseCase.getUserProfiles(codeProfiles)) as ProfilModel[];
  const profilesInstitutionValues = profiles.map((profile) => profile?.value.institution.profilMédicoSocial);
  const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilMédicoSocial);

  const profilInstitution = combineProfils(profilesInstitutionValues);
  const profilAutreReg = combineProfils(profilesAutreRegValues);

  const autorisations = établissementTerritorialMédicoSocial.identité.codeRegion === codeRegion ? profilInstitution : profilAutreReg;

  return { ...filterEtablissementMedicoSocial(établissementTerritorialMédicoSocial, autorisations), autorisations: autorisations };
}

import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ÉtablissementTerritorialSanitaire } from "../../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLÉtablissementTerritorialSanitaireUseCase } from "../../métier/use-cases/RécupèreLÉtablissementTerritorialSanitaireUseCase";
import { combineProfils, filterEtablissementSanitaire } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

export async function récupèreLÉtablissementTerritorialSanitaireEndpoint(
  dependencies: Dependencies,
  numéroFinessÉtablissementTerritorialSanitaire: string,
  codeRegion: string,
  codeProfiles: string[],
): Promise<ÉtablissementTerritorialSanitaire> {
  const récupèreLÉtablissementTerritorialSanitaireUseCase = new RécupèreLÉtablissementTerritorialSanitaireUseCase(
    dependencies.établissementTerritorialSanitaireLoader,
    dependencies.entitéJuridiqueLoader
  );

  const etablissementSanitaire = await récupèreLÉtablissementTerritorialSanitaireUseCase.exécute(numéroFinessÉtablissementTerritorialSanitaire);

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);

  const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
  const profilesInstitutionValues = profiles.map((profile) => profile?.value.institution.profilETSanitaire)
  const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilETSanitaire)

  const profilInstitution = combineProfils(profilesInstitutionValues);
  const profilAutreReg = combineProfils(profilesAutreRegValues);

  return filterEtablissementSanitaire(etablissementSanitaire, etablissementSanitaire.identité.codeRegion === codeRegion ? profilInstitution : profilAutreReg);
}

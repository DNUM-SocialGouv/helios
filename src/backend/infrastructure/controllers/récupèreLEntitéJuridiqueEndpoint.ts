import { ProfilModel } from "../../../../database/models/ProfilModel";
import { EntitéJuridique } from "../../métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLEntitéJuridiqueUseCase } from "../../métier/use-cases/RécupèreLEntitéJuridiqueUseCase";
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from "../../métier/use-cases/RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase";
import { combineProfils, filterEntiteJuridique } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

type EntitéJuridiqueEndpoint = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
}>;

export async function récupèreLEntitéJuridiqueEndpoint(dependencies: Dependencies, numéroFiness: string, codeRegion: string, codeProfiles: string[]): Promise<EntitéJuridiqueEndpoint> {
  const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(dependencies.entitéJuridiqueLoader);
  const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFiness);

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profiles = await loginUseCase.getUserProfiles(codeProfiles) as ProfilModel[];
  const profilesInstitutionValues = profiles.map((profile) => profile?.value.institution.profilEJ)
  const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilEJ)

  const profilInstitution = combineProfils(profilesInstitutionValues);
  const profilAutreReg = combineProfils(profilesAutreRegValues);

  const filtredEntitéJuridique = filterEntiteJuridique(entitéJuridique, entitéJuridique.codeRegion === codeRegion ? profilInstitution : profilAutreReg);


  const récupèreLesÉtablissementsTerritoriauxRattachésUseCase = new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(
    dependencies.établissementTerritorialRattachéLoader
  );
  const établissementsTerritoriauxRattachés = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFiness);

  return {
    entitéJuridique: filtredEntitéJuridique,
    établissementsTerritoriauxRattachés,
  };
}

import { ProfilModel } from "../../../../database/models/ProfilModel";
import appCache from "../../cacheProvider";
import { EntitéJuridique } from "../../métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialRattaché } from "../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { LoginUseCase } from "../../métier/use-cases/LoginUseCase";
import { RécupèreLEntitéJuridiqueUseCase } from "../../métier/use-cases/RécupèreLEntitéJuridiqueUseCase";
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from "../../métier/use-cases/RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase";
import { filterEntiteJuridique } from "../../profileFiltersHelper";
import { Dependencies } from "../dependencies";

type EntitéJuridiqueEndpoint = Readonly<{
  entitéJuridique: EntitéJuridique;
  établissementsTerritoriauxRattachés: ÉtablissementTerritorialRattaché[];
}>;

export async function récupèreLEntitéJuridiqueEndpoint(dependencies: Dependencies, numéroFiness: string, codeRegion: string): Promise<EntitéJuridiqueEndpoint> {
  const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase(dependencies.entitéJuridiqueLoader);
  const entitéJuridique = await récupèreLEntitéJuridiqueUseCase.exécute(numéroFiness);

  const loginUseCase = new LoginUseCase(dependencies.utilisateurLoader);
  const profilInCache = appCache.get("userProfile") as ProfilModel;
  let profil: ProfilModel | null;
  if (profilInCache === undefined) {
    profil = await loginUseCase.getProfile();
    appCache.set("userProfile", profil, 3600);
  } else {
    profil = profilInCache;
  }

  const profilEJ = entitéJuridique.codeRegion === codeRegion ? profil?.value.institution.profilEJ : profil?.value.autreRegion.profilEJ;

  const filtredEntitéJuridique = filterEntiteJuridique(entitéJuridique, profilEJ);

  const récupèreLesÉtablissementsTerritoriauxRattachésUseCase = new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(
    dependencies.établissementTerritorialRattachéLoader
  );
  const établissementsTerritoriauxRattachés = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFiness);

  return {
    entitéJuridique: filtredEntitéJuridique,
    établissementsTerritoriauxRattachés,
  };
}

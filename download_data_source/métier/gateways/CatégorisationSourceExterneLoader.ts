import { NiveauxStatutsJuridiques } from "../entities/NiveauxStatutsJuridiques";

export interface CatégorisationSourceExterneLoader {
  récupèreLesNiveauxDesStatutsJuridiques(): Promise<NiveauxStatutsJuridiques[]>;
}

import { NiveauxStatutsJuridiques } from "../entities/NiveauxStatutsJuridiques";

export interface StatutsJuridiquesSourceExterneLoader {
  récupèreLesNiveauxDesStatutsJuridiques(): NiveauxStatutsJuridiques[];
}

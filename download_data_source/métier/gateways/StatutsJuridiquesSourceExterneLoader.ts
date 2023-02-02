import { NiveauStatutJuridique } from "../entities/NiveauStatutJuridique";

export interface StatutsJuridiquesSourceExterneLoader {
  récupèreLesNiveauxDesStatutsJuridiques(): NiveauStatutJuridique[];
}

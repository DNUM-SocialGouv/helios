import { NiveauxStatutsJuridiques } from "../../../métier/entities/NiveauxStatutsJuridiques";
import { CatégorisationSourceExterneLoader } from "../../../métier/gateways/CatégorisationSourceExterneLoader";

export class XMLCatégorisationSourceExterneLoader implements CatégorisationSourceExterneLoader {
  récupèreLesNiveauxDesStatutsJuridiques(): Promise<NiveauxStatutsJuridiques[]> {
    return Promise.resolve([]);
  }
}

import { readdirSync } from "fs";

import { NiveauxStatutsJuridiques } from "../../../métier/entities/NiveauxStatutsJuridiques";
import { Logger } from "../../../métier/gateways/Logger";
import { StatutsJuridiquesSourceExterneLoader } from "../../../métier/gateways/StatutsJuridiquesSourceExterneLoader";
import { XmlToJs } from "../../../métier/gateways/XmlToJs";

type NiveauStatutJuridiqueFiness = Readonly<{
  code: Readonly<{ _text: string }>;
  codeagr2: Readonly<{ _text: string }>;
  codeagr1: Readonly<{ _text: string }>;
}>;

type NiveauStatutJuridiqueFluxFiness = Readonly<{
  fluxfiness: Readonly<{ nomenclstatutavecagr: NiveauStatutJuridiqueFiness[] }>;
}>;

export class XMLStatutsJuridiquesSourceExterneLoader implements StatutsJuridiquesSourceExterneLoader {
  private readonly préfixeDuFichierNomenclature = "finess_cs1500107_stock_";

  constructor(private readonly convertXmlToJs: XmlToJs, private readonly localPath: string, private readonly logger: Logger) {}

  récupèreLesNiveauxDesStatutsJuridiques(): NiveauxStatutsJuridiques[] {
    const cheminDuFichierNomenclature = this.récupèreLeCheminDuFichierNomenclature(this.localPath);

    const niveauxStatutsJuridiqueFluxFiness = this.convertXmlToJs.exécute<NiveauStatutJuridiqueFluxFiness>(cheminDuFichierNomenclature);
    const niveauxStatutsJuridiquesFiness = niveauxStatutsJuridiqueFluxFiness.fluxfiness.nomenclstatutavecagr;
    this.logger.info(`[FINESS] ${niveauxStatutsJuridiquesFiness.length} statuts juridiques récupérées depuis FINESS.`);

    return niveauxStatutsJuridiquesFiness.map(this.construisLesNiveauxDeStatutsJuridique);
  }

  private récupèreLeCheminDuFichierNomenclature(localPath: string): string {
    const directoryPath = `finess/nomenclature/`;
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/${directoryPath}`);

    return localPath + "/" + directoryPath + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierNomenclature));
  }

  private construisLesNiveauxDeStatutsJuridique(niveauStatutJuridique: NiveauStatutJuridiqueFiness): NiveauxStatutsJuridiques {
    return {
      statutJuridique: niveauStatutJuridique.code._text,
      statutJuridiqueNiv1: niveauStatutJuridique.codeagr1._text,
      statutJuridiqueNiv2: niveauStatutJuridique.codeagr2._text,
    };
  }
}

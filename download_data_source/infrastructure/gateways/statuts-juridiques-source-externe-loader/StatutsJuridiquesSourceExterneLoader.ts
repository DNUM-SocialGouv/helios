import { readdirSync } from "fs";

import { NiveauxStatutsJuridiques } from "../../../métier/entities/NiveauxStatutsJuridiques";
import { Logger } from "../../../métier/gateways/Logger";
import { StatutsJuridiquesSourceExterneLoader } from "../../../métier/gateways/StatutsJuridiquesSourceExterneLoader";
import { XmlToJs } from "../../../métier/gateways/XmlToJs";

type NiveauStatutJuridiqueFiness = Readonly<{
  code: Readonly<{ _text?: string }>;
  libelle: Readonly<{ _text?: string }>;
  libellecourt: Readonly<{ _text?: string }>;
  datedeb: Readonly<{ _text?: string }>;
  datefin: Readonly<{ _text?: string }>;
  codeagr2: Readonly<{ _text?: string }>;
  libelleagr2: Readonly<{ _text?: string }>;
  libellecourtagr2: Readonly<{ _text?: string }>;
  codeagr3: Readonly<{ _text?: string }>;
  libelleagr3: Readonly<{ _text?: string }>;
  libellecourtagr3: Readonly<{ _text?: string }>;
  codeagr1: Readonly<{ _text?: string }>;
  libelleagr1: Readonly<{ _text?: string }>;
  libellecourtagr1: Readonly<{ _text?: string }>;
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
    const filePath = `finess/nomenclature/`;
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/${filePath}`);

    return localPath + "/" + filePath + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierNomenclature));
  }

  private construisLesNiveauxDeStatutsJuridique(niveauStatutJuridique: NiveauStatutJuridiqueFiness): NiveauxStatutsJuridiques {
    const valueOrEmpty = (value?: string): string => value || "";

    return {
      statutJuridique: valueOrEmpty(niveauStatutJuridique.code._text),
      statutJuridiqueNiv1: valueOrEmpty(niveauStatutJuridique.codeagr1._text),
      statutJuridiqueNiv2: valueOrEmpty(niveauStatutJuridique.codeagr2._text),
    };
  }
}

import { readdirSync } from "fs";
import { DataSource } from "typeorm";

import { RefDepartementRegionModel } from "../../../../database/models/RefDepartementRegionModel";
import { EntitéJuridique } from "../../../métier/entities/EntitéJuridique";
import { EntitéJuridiqueSourceExterneLoader } from "../../../métier/gateways/EntitéJuridiqueSourceExterneLoader";
import { Logger } from "../../../métier/gateways/Logger";
import { XmlToJs } from "../../../métier/gateways/XmlToJs";

type EntitéJuridiqueFiness = Readonly<{
  categetab: Readonly<{
    _text?: string;
  }>;
  codeape: Readonly<{
    _text?: string;
  }>;
  codepays: Readonly<{
    _text?: string;
  }>;
  codepostal: Readonly<{
    _text?: string;
  }>;
  commune: Readonly<{
    _text?: string;
  }>;
  compldistrib: Readonly<{
    _text?: string;
  }>;
  complrs: Readonly<{
    _text?: string;
  }>;
  compvoie: Readonly<{
    _text?: string;
  }>;
  datecrea: Readonly<{
    _text?: string;
  }>;
  datefermeture: Readonly<{
    _text?: string;
  }>;
  datemaj: Readonly<{
    _text?: string;
  }>;
  datemodifsiren: Readonly<{
    _text?: string;
  }>;
  departement: Readonly<{
    _text?: string;
  }>;
  libcategetab: Readonly<{
    _text?: string;
  }>;
  libcommune: Readonly<{
    _text?: string;
  }>;
  libcourtcategetab: Readonly<{
    _text?: string;
  }>;
  libcourtstatutjuridique: Readonly<{
    _text?: string;
  }>;
  libdepartement: Readonly<{
    _text?: string;
  }>;
  libellepays: Readonly<{
    _text?: string;
  }>;
  libstatutjuridique: Readonly<{
    _text?: string;
  }>;
  lieuditbp: Readonly<{
    _text?: string;
  }>;
  ligneacheminement: Readonly<{
    _text?: string;
  }>;
  nofiness: Readonly<{
    _text?: string;
  }>;
  numvoie: Readonly<{
    _text?: string;
  }>;
  originemodifsiren: Readonly<{
    _text?: string;
  }>;
  qualifcreation: Readonly<{
    _text?: string;
  }>;
  rs: Readonly<{
    _text?: string;
  }>;
  rslongue: Readonly<{
    _text?: string;
  }>;
  siren: Readonly<{
    _text?: string;
  }>;
  statutjuridique: Readonly<{
    _text?: string;
  }>;
  telecopie: Readonly<{
    _text?: string;
  }>;
  telephone: Readonly<{
    _text?: string;
  }>;
  typefermeture: Readonly<{
    _text?: string;
  }>;
  typvoie: Readonly<{
    _text?: string;
  }>;
  voie: Readonly<{
    _text?: string;
  }>;
}>;

type EntitéJuridiqueFluxFiness = Readonly<{
  fluxfiness: Readonly<{
    structureej: EntitéJuridiqueFiness[];
  }>;
}>;

export class FinessXmlEntitésJuridiquesSourceExterneLoader implements EntitéJuridiqueSourceExterneLoader {
  private readonly préfixeDuFichierEntitéJuridique = "finess_cs1400101_stock_";

  constructor(private readonly convertXmlToJs: XmlToJs, private readonly localPath: string, private logger: Logger, private readonly orm: Promise<DataSource>) { }

  async récupèreLesEntitésJuridiquesOuvertes(): Promise<EntitéJuridique[]> {
    const cheminDuFichierEntitéJuridique = this.récupèreLeCheminDuFichierEntitéJuridique(this.localPath);
    const entitésJuridiquesFluxFiness = this.convertXmlToJs.exécute<EntitéJuridiqueFluxFiness>(cheminDuFichierEntitéJuridique);
    const entitésJuridiquesFiness = entitésJuridiquesFluxFiness.fluxfiness.structureej;
    this.logger.info(`[FINESS] ${entitésJuridiquesFiness.length} entités juridiques récupérées depuis FINESS.`);

    const entitésJuridiquesFinessOuvertes = this.conserveLesEntitésJuridiquesOuvertes(entitésJuridiquesFiness);
    this.logger.info(`[FINESS] ${entitésJuridiquesFinessOuvertes.length} entités juridiques sont ouvertes.`);

    return this.construisLesEntitéssJuridiques(entitésJuridiquesFinessOuvertes);
  }

  récupèreLaDateDeMiseÀJourDuFichierSource(): string {
    const cheminDuFichierEntitéJuridique = this.récupèreLeCheminDuFichierEntitéJuridique(this.localPath);
    const dateDeMiseAJourDuFichierSource = cheminDuFichierEntitéJuridique.split(this.préfixeDuFichierEntitéJuridique)[1].slice(0, 8);
    this.logger.info(`[FINESS] Date de mise à jour des fichiers FINESS des entités juridiques : ${dateDeMiseAJourDuFichierSource}`);

    return dateDeMiseAJourDuFichierSource;
  }

  private async construisLesEntitéssJuridiques(établissementsTerritoriauxFinessOuverts: EntitéJuridiqueFiness[]) {
    const results: EntitéJuridique[] = [];

    for (const établissementTerritorialIdentitéFiness of établissementsTerritoriauxFinessOuverts) {
      const result = await this.construisLEntitéJuridique(établissementTerritorialIdentitéFiness)
      results.push(result);
    }
    return results;
  }


  private conserveLesEntitésJuridiquesOuvertes(entitésJuridiquesFiness: EntitéJuridiqueFiness[]) {
    return entitésJuridiquesFiness.filter((entitéJuridiqueFiness: EntitéJuridiqueFiness) => entitéJuridiqueFiness.datefermeture._text === undefined);
  }

  private récupèreLeCheminDuFichierEntitéJuridique(localPath: string): string {
    const fichiersDuRépertoireSimple = readdirSync(`${localPath}/finess/simple`);

    return localPath + "/finess/simple/" + fichiersDuRépertoireSimple.filter((fichier) => fichier.includes(this.préfixeDuFichierEntitéJuridique));
  }

  private getOutreMerDepartement(departementCode: string) {
    switch (departementCode) {
      case '9A':
        return '971';
      case '9B':
        return '972';
      case '9C':
        return '973';
      case '9D':
        return '974';
      case '9F':
        return '976';
      default:
        return departementCode;
    }
  }

  private async construisLEntitéJuridique(entitésJuridiquesFiness: EntitéJuridiqueFiness): Promise<EntitéJuridique> {
    const valueOrEmpty = (value?: string): string => value || "";

    const codeDepartement = this.getOutreMerDepartement(valueOrEmpty(entitésJuridiquesFiness.departement._text));
    const ref = await (await this.orm).getRepository(RefDepartementRegionModel).findOne({ where: { codeDepartement: codeDepartement } });

    return {
      adresseAcheminement: valueOrEmpty(entitésJuridiquesFiness.ligneacheminement._text),
      adresseNuméroVoie: valueOrEmpty(entitésJuridiquesFiness.numvoie._text),
      adresseTypeVoie: valueOrEmpty(entitésJuridiquesFiness.typvoie._text),
      adresseVoie: valueOrEmpty(entitésJuridiquesFiness.voie._text),
      commune: valueOrEmpty(entitésJuridiquesFiness.libcommune._text),
      département: valueOrEmpty(entitésJuridiquesFiness.libdepartement._text),
      libelléStatutJuridique: valueOrEmpty(entitésJuridiquesFiness.libstatutjuridique._text),
      numéroFinessEntitéJuridique: valueOrEmpty(entitésJuridiquesFiness.nofiness._text),
      raisonSociale: valueOrEmpty(entitésJuridiquesFiness.rslongue._text)
        ? valueOrEmpty(entitésJuridiquesFiness.rslongue._text)
        : valueOrEmpty(entitésJuridiquesFiness.rs._text),
      raisonSocialeCourte: valueOrEmpty(entitésJuridiquesFiness.rs._text),
      siren: valueOrEmpty(entitésJuridiquesFiness.siren._text),
      statutJuridique: valueOrEmpty(entitésJuridiquesFiness.statutjuridique._text),
      téléphone: valueOrEmpty(entitésJuridiquesFiness.telephone._text),
      codeRégion: valueOrEmpty(ref?.codeRegion),
      dateOuverture: valueOrEmpty(entitésJuridiquesFiness.datecrea._text)
    };
  }
}

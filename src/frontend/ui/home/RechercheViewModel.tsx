import { ReactElement } from "react";

import { Résultat } from "../../../backend/métier/entities/RésultatDeRecherche";
import { Paths } from "../../configuration/Paths";
import LogoÉtablissementTerritorialMédicoSocial from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg";
import LogoÉtablissementTerritorialSanitaire from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg";
import LogoEntitéJuridiqueNoir from "./logo-entité-juridique-noir.svg";

export class RechercheViewModel {
  constructor(private readonly recherche: Résultat, private readonly paths: Paths) { }

  public get numéroFiness(): string {
    return this.recherche.numéroFiness;
  }

  public get type(): string {
    return this.recherche.type;
  }

  public get commune(): string {
    return this.recherche.commune;
  }

  public get departement(): string {
    return this.recherche.département;
  }

  public get socialReason(): string {
    return this.recherche.raisonSocialeCourte;
  }

  public get rattachement(): string {
    return this.recherche.rattachement;
  }

  public get titre(): ReactElement {
    return (
      <>
        {this.recherche.numéroFiness}
        {" - "}
        {this.recherche.raisonSocialeCourte}
      </>
    );
  }

  public get départementEtCommune(): ReactElement {
    return (
      <>
        {this.recherche.département.toLocaleLowerCase()}
        {", "}
        {this.recherche.commune.toLocaleLowerCase()}
      </>
    );
  }

  public afficheLeLogo = (): string => {
    if (this.recherche.type === "Médico-social") {
      return LogoÉtablissementTerritorialMédicoSocial;
    } else if (this.recherche.type === "Sanitaire") {
      return LogoÉtablissementTerritorialSanitaire;
    }
    return LogoEntitéJuridiqueNoir;
  };

  public construisLeLien = (isSimpleSearch: boolean | undefined): string => {
    if (this.recherche.type === "Médico-social") {
      return this.paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL + "/" + this.recherche.numéroFiness + (isSimpleSearch ? "?termeSimple=" + localStorage.getItem('searchItem') : "");
    } else if (this.recherche.type === "Sanitaire") {
      return this.paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE + "/" + this.recherche.numéroFiness + (isSimpleSearch ? "?termeSimple=" + localStorage.getItem('searchItem') : "");
    }
    return this.paths.ENTITÉ_JURIDIQUE + "/" + this.recherche.numéroFiness + (isSimpleSearch ? "?termeSimple=" + localStorage.getItem('searchItem') : "");
  };
}

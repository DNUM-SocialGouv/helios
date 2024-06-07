import Link from "next/link";
import { ReactElement } from "react";

import { ÉtablissementTerritorialSanitaire } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { Paths } from "../../../configuration/Paths";
import { Wording } from "../../../configuration/wording/Wording";
import { StringFormater } from "../../commun/StringFormater";

export class ÉtablissementTerritorialSanitaireIdentitéViewModel {
  constructor(
    private readonly établissementTerritorialSanitaireIdentité: ÉtablissementTerritorialSanitaire["identité"],
    private readonly wording: Wording,
    private readonly paths: Paths
  ) {}

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialSanitaireIdentité.raisonSociale.value;
  }

  public get nomCourtDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialSanitaireIdentité.raisonSocialeCourte.value;
  }

  public get dateDeMiseÀJourDuNomDeLÉtablissementTerritorial(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.raisonSociale.dateMiseÀJourSource);
  }

  public get dateOuvertureÉtablissementTerritorial(): string {
    if(this.établissementTerritorialSanitaireIdentité.dateOuverture && this.établissementTerritorialSanitaireIdentité.dateOuverture.value)
    {
      return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.dateOuverture.value);
    }
    return "Non renseigné"
  }

  public get dateDeMiseÀJourOuvertureÉtablissementTerritorial(): string {
    if(this.établissementTerritorialSanitaireIdentité.dateOuverture && this.établissementTerritorialSanitaireIdentité.dateOuverture.dateMiseÀJourSource)
    {
      return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.dateOuverture.dateMiseÀJourSource);
    }
    return "Non renseigné"
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.établissementTerritorialSanitaireIdentité.numéroFinessÉtablissementTerritorial.value;
  }

  public get dateDeMiseÀJourDuSiret(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.siret.dateMiseÀJourSource);
  }

  public get siret(): string {
    return this.établissementTerritorialSanitaireIdentité.siret.value;
  }

  public get dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.numéroFinessÉtablissementTerritorial.dateMiseÀJourSource);
  }

  public get adresse(): string {
    return `${this.établissementTerritorialSanitaireIdentité.adresseNuméroVoie.value} ${this.établissementTerritorialSanitaireIdentité.adresseTypeVoie.value} ${this.établissementTerritorialSanitaireIdentité.adresseVoie.value} ${this.établissementTerritorialSanitaireIdentité.adresseAcheminement.value}`;
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.adresseNuméroVoie.dateMiseÀJourSource);
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formatPhoneNumber(this.établissementTerritorialSanitaireIdentité.téléphone.value));
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialSanitaireIdentité.courriel.value);
    return `${téléphoneFormaté} | ${email}`;
  }

  public get dateDeMiseÀJourDutéléphoneEtDeLEmail(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.téléphone.dateMiseÀJourSource);
  }

  public get entitéJuridiqueDeRattachement(): ReactElement {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorialSanitaireIdentité.numéroFinessEntitéJuridique.value}`;
    const nomDeLEntitéJuridique = this.établissementTerritorialSanitaireIdentité.raisonSocialeDeLEntitéDeRattachement.value;
    const libellé = `EJ - ${this.établissementTerritorialSanitaireIdentité.numéroFinessEntitéJuridique.value} - ${nomDeLEntitéJuridique}`;

    return (
      <Link href={lienVersLEntitéJuridique} legacyBehavior passHref prefetch={false}>
        {libellé}
      </Link>
    );
  }

  public get dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.raisonSocialeDeLEntitéDeRattachement.dateMiseÀJourSource);
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialSanitaireIdentité.catégorieÉtablissement.value} - ${this.établissementTerritorialSanitaireIdentité.libelléCatégorieÉtablissement.value}`;
  }

  public get dateDeMiseÀJourDeLaCatégorieDeLÉtablissement(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.catégorieÉtablissement.dateMiseÀJourSource);
  }

  public get modeDeTarification(): string {
    return `${this.établissementTerritorialSanitaireIdentité.codeModeTarification.value} - ${this.établissementTerritorialSanitaireIdentité.libelléModeTarification.value}`;
  }

  public get dateDeMiseÀJourDuModeDeTarification(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.codeModeTarification.dateMiseÀJourSource);
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialSanitaireIdentité.statutJuridique.value;
  }

  public get dateDeMiseÀJourDuStatutDeLÉtablissement(): string {
    return StringFormater.formatDate(this.établissementTerritorialSanitaireIdentité.statutJuridique.dateMiseÀJourSource);
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === "" ? this.wording.NON_RENSEIGNÉ : valeur;
  }
}

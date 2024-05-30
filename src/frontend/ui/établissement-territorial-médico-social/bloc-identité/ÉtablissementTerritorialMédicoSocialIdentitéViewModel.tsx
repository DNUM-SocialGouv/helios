import Link from "next/link";
import { ReactElement } from "react";

import { ÉtablissementTerritorialMédicoSocial } from "../../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { Paths } from "../../../configuration/Paths";
import { Wording } from "../../../configuration/wording/Wording";
import { StringFormater } from "../../commun/StringFormater";

export class ÉtablissementTerritorialMédicoSocialIdentitéViewModel {
  constructor(
    private readonly établissementTerritorialIdentité: ÉtablissementTerritorialMédicoSocial["identité"],
    private readonly wording: Wording,
    private readonly paths: Paths
  ) { }

  public get nomDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSociale.value;
  }

  public get nomCourtDeLÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.raisonSocialeCourte.value;
  }

  public get dateDeMiseÀJourDuNomDeLÉtablissementTerritorial(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.raisonSociale.dateMiseÀJourSource);
  }

  public get dateOuvertureÉtablissementTerritorial(): string {
    if(this.établissementTerritorialIdentité.dateOuverture && this.établissementTerritorialIdentité.dateOuverture.value)
    {
      return StringFormater.formatDate(this.établissementTerritorialIdentité.dateOuverture.value);
    }
    return "Non renseigné"
  }

  public get dateDeMiseÀJourOuvertureÉtablissementTerritorial(): string {
    if(this.établissementTerritorialIdentité.dateOuverture && this.établissementTerritorialIdentité.dateOuverture.dateMiseÀJourSource)
    {
      return StringFormater.formatDate(this.établissementTerritorialIdentité.dateOuverture.dateMiseÀJourSource);
    }
    return "Non renseigné"
  }

  public get numéroFinessÉtablissementTerritorial(): string {
    return this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial.value;
  }

  public get dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial.dateMiseÀJourSource);
  }

  public get siret(): string {
    return this.établissementTerritorialIdentité.siret.value;
  }

  public get dateDeMiseÀJourDuSiret(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.siret.dateMiseÀJourSource);
  }

  public get adresse(): string {
    return `${this.établissementTerritorialIdentité.adresseNuméroVoie.value} ${this.établissementTerritorialIdentité.adresseTypeVoie.value} ${this.établissementTerritorialIdentité.adresseVoie.value} ${this.établissementTerritorialIdentité.adresseAcheminement.value}`;
  }

  public get dateDeMiseÀJourDeLAdresse(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.adresseNuméroVoie.dateMiseÀJourSource);
  }

  public get téléphoneEtEmail(): string {
    const téléphoneFormaté = this.valeurOuNonRenseigné(StringFormater.formatPhoneNumber(this.établissementTerritorialIdentité.téléphone.value));
    const email = this.valeurOuNonRenseigné(this.établissementTerritorialIdentité.courriel.value);
    return `${téléphoneFormaté} | ${email}`;
  }

  public get dateDeMiseÀJourDuTéléphoneEtDeLEmail(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.téléphone.dateMiseÀJourSource);
  }

  public get entitéJuridiqueDeRattachement(): ReactElement {
    const lienVersLEntitéJuridique = `${this.paths.ENTITÉ_JURIDIQUE}/${this.établissementTerritorialIdentité.numéroFinessEntitéJuridique.value}`;
    const titreDeLEntitéJuridiqueDeRattachement = this.formateLeTitreDeLEntitéJuridiqueDeRattachement();
    const libellé = `EJ - ${titreDeLEntitéJuridiqueDeRattachement}`;

    return (
      <Link href={lienVersLEntitéJuridique} legacyBehavior passHref prefetch={false}>
        {libellé}
      </Link>
    );
  }

  public get dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement.dateMiseÀJourSource);
  }

  public get catégorieDeLÉtablissement(): string {
    return `${this.établissementTerritorialIdentité.catégorieÉtablissement.value} - ${this.établissementTerritorialIdentité.libelléCatégorieÉtablissement.value}`;
  }

  public get dateDeMiseÀJourDeLaCatégorieDeLÉtablissement(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.catégorieÉtablissement.dateMiseÀJourSource);
  }

  public get modeDeTarification(): string {
    return `${this.établissementTerritorialIdentité.codeModeTarification.value} - ${this.établissementTerritorialIdentité.libelléModeTarification.value}`;
  }

  public get dateDeMiseÀJourDuModeDeTarification(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.codeModeTarification.dateMiseÀJourSource);
  }

  public get statutDeLÉtablissement(): string {
    return this.établissementTerritorialIdentité.statutJuridique.value;
  }

  public get dateDeMiseÀJourDuStatutDeLÉtablissement(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.statutJuridique.dateMiseÀJourSource);
  }

  public get monoÉtablissement(): string {
    return this.établissementTerritorialIdentité.estMonoÉtablissement.value ? this.wording.OUI : this.wording.NON;
  }

  public get dateDeMiseÀJourDuMonoÉtablissement(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.estMonoÉtablissement.dateMiseÀJourSource);
  }

  public get principalOuSecondaire(): string {
    return this.établissementTerritorialIdentité.typeÉtablissement.value === "P"
      ? this.wording.PRINCIPAL
      : `${this.wording.SECONDAIRE} (${this.wording.PRINCIPAL} : ${this.établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal.value})`;
  }

  public get dateDeMiseÀJourDuPrincipalOuDuSecondaire(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal.dateMiseÀJourSource);
  }

  public get dateDeLEntréeEnVigueurDuCpom(): string {
    const dateDEntréeEnVigueurDuCpom = this.établissementTerritorialIdentité.dateDEntréeEnVigueurDuCpom.value;
    return dateDEntréeEnVigueurDuCpom !== "" ? StringFormater.formatDate(dateDEntréeEnVigueurDuCpom) : this.wording.NON_RENSEIGNÉ;
  }

  public get dateDeMiseÀJourDeLEntréeEnVigueurDuCpom(): string {
    return StringFormater.formatDate(this.établissementTerritorialIdentité.dateDEntréeEnVigueurDuCpom.dateMiseÀJourSource);
  }

  private formateLeTitreDeLEntitéJuridiqueDeRattachement(): string {
    const nomDeLEntitéJuridique = this.établissementTerritorialIdentité.raisonSocialeDeLEntitéDeRattachement.value;
    return `${this.établissementTerritorialIdentité.numéroFinessEntitéJuridique.value} - ${nomDeLEntitéJuridique}`;
  }

  private valeurOuNonRenseigné(valeur: string): string {
    return valeur === "" ? this.wording.NON_RENSEIGNÉ : valeur;
  }

  public get laDateDeLEntréeEnVigueurDuCpomsEstElleAutorisée(): boolean {
    return this.établissementTerritorialIdentité.dateDEntréeEnVigueurDuCpom.dateMiseÀJourSource !== '';
  }

  public get lesDonnéesIdentitésPasAutorisés(): (string | ReactElement)[] {
    const nonAutorisés = [];
    if (!this.laDateDeLEntréeEnVigueurDuCpomsEstElleAutorisée) nonAutorisés.push(this.wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM);

    return nonAutorisés;
  }

}

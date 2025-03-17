import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

import { CpomModel } from "./CpomModel";
import { EntitéJuridiqueModel } from "./EntitéJuridiqueModel";
import { DomaineÉtablissementTerritorial } from "../../download_data_source/métier/entities/DomaineÉtablissementTerritorial";

@Entity({ name: "etablissement_territorial" })
export class ÉtablissementTerritorialIdentitéModel {
  @Column({ length: 255, name: "adresse_acheminement" })
  public adresseAcheminement!: string;

  @Column({ length: 5, name: "adresse_numero_voie" })
  public adresseNuméroVoie!: string;

  @Column({ length: 4, name: "adresse_type_voie" })
  public adresseTypeVoie!: string;

  @Column({ length: 255, name: "adresse_voie" })
  public adresseVoie!: string;

  @Column({ length: 3, name: "cat_etablissement" })
  public catégorieÉtablissement!: string;

  @Column({ length: 2, name: "code_mode_tarification" })
  public codeModeTarification!: string;

  @Column({ length: 255, name: "commune" })
  public commune!: string;

  @Column({ length: 255, name: "courriel" })
  public courriel!: string;

  @Column({ length: 255, name: "departement" })
  public département!: string;

  @Column({
    length: 255,
    name: "code_region",
    default: ''
  })
  public codeRégion!: string;

  @Column({
    enum: DomaineÉtablissementTerritorial,
    enumName: "domaine_et",
    type: "enum",
  })
  public domaine!: DomaineÉtablissementTerritorial;

  @ManyToOne(() => EntitéJuridiqueModel, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "numero_finess_entite_juridique", referencedColumnName: "numéroFinessEntitéJuridique" })
  public entitéJuridique!: EntitéJuridiqueModel;

  @Column({ length: 255, name: "libelle_categorie_etablissement" })
  public libelléCatégorieÉtablissement!: string;

  @Column({ length: 255, name: "libelle_court_categorie_etablissement" })
  public libelléCourtCatégorieÉtablissement!: string;

  @Column({ length: 50, name: "classification" })
  public classificationEtablissement!: string;

  @Column({ length: 255, name: "libelle_du_mode_tarification" })
  public libelléModeTarification!: string;

  @Column({ length: 9, name: "numero_finess_entite_juridique" })
  public numéroFinessEntitéJuridique!: string;

  @Column({ length: 9, name: "numero_finess_etablissement_principal" })
  public numéroFinessÉtablissementPrincipal!: string;

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;

  @Column({ length: 255, name: "raison_sociale" })
  public raisonSociale!: string;

  @Column({ length: 255, name: "raison_sociale_courte" })
  public raisonSocialeCourte!: string;

  @Column({ length: 14, name: "siret" })
  public siret!: string;

  @Column({ length: 10, name: "telephone" })
  public téléphone!: string;

  @Column({ length: 1, name: "type_etablissement" })
  public typeÉtablissement!: string;

  @OneToOne(() => CpomModel, { nullable: true })
  @JoinColumn({ name: "numero_finess_etablissement_territorial", referencedColumnName: "numéroFinessÉtablissementTerritorial" })
  public cpom!: CpomModel;

  @Column({ type: 'date', name: "date_ouverture", nullable: true })
  public dateOuverture!: string;
}

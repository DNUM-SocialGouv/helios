import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "qualite_has_et" })
export class QualiteQualiscopeHASModel {

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;

  @Column({ name: "score_appreciation_mco" })
  public scoreAppreciationMco!: number;

  @Column({ name: "score_appreciation_ca" })
  public scoreAppreciationCa!: number;

  @Column({ name: "score_prise_en_charge_douleur" })
  public scorePriseEnChargeDouleur!: number;

  @Column({ name: "classe_prise_en_charge_douleur" })
  public classePriseEnChargeDouleur!: string;

  @Column({ name: "certification_note" })
  public noteCertification!: number;

  @Column({ name: "certification_date", type: "date" })
  public dateCertification!: string;

}

import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionFiliereModel } from "./referentiel/VigieRhRefProfessionFiliereModel";

@Entity("vigie_rh_profession_filiere")
export class VigieRhProfessionFiliereModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @PrimaryColumn({ type: "int", name: "profession" })
  public professionId!: number;

  @ManyToOne(() => VigieRhRefProfessionFiliereModel, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: "profession" })
  public readonly profession!: VigieRhRefProfessionFiliereModel;

  @Column({ type: "float", nullable: true, name: "turnover" })
  public turnover!: number | null;

  @Column({ type: "float", nullable: true, name: "entree_taux" })
  public entreeTaux!: number | null;

  @Column({ type: "float", nullable: true, name: "entree_sortie" })
  public entreeSortie!: number | null;

  @Column({ type: "int", nullable: true, name: "entrees" })
  public entrees!: number | null;

  @Column({ type: "int", nullable: true, name: "sorties" })
  public sorties!: number | null;

  @Column({ type: "float", nullable: true, name: "turnover_ref_region" })
  public turnoverRefRegion!: number | null;

  @Column({ type: "float", nullable: true, name: "turnover_ref_nation" })
  public turnoverRefNation!: number | null;

  @Column({ type: "float", nullable: true, name: "turnover_ref_categorie" })
  public turnoverRefCategorie!: number | null;
}

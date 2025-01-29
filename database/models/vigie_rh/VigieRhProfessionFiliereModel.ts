import { Entity, PrimaryColumn, Column, Index, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionFiliereModel } from "./referentiel/VigieRhRefProfessionFiliereModel";

@Entity("vigie_rh_profession_filiere")
@Index("idx_profession", ["profession"])  // Création de l'index sur la colonne "profession"
export class VigieRhProfessionFiliereModel {
  @PrimaryColumn({ type: "varchar", length: 9 })
  public numero_finess!: string;

  @PrimaryColumn()
  public annee!: number;

  @PrimaryColumn()
  public mois!: number;

  @ManyToOne(() => VigieRhRefProfessionFiliereModel, { nullable: true })
  @JoinColumn({ name: "profession" })
  public profession!: VigieRhRefProfessionFiliereModel;

  @Column({ type: "float", nullable: true })
  public turnover!: number;

  @Column({ type: "float", nullable: true })
  public entree_taux!: number;

  @Column({ type: "float", nullable: true })
  public entree_sortie!: number;

  @Column({ type: "int", nullable: true })
  public entrees!: number;

  @Column({ type: "int", nullable: true })
  public sorties!: number;

  @Column({ type: "float", nullable: true })
  public turnover_ref_region!: number;

  @Column({ type: "float", nullable: true })
  public turnover_ref_nation!: number;

  @Column({ type: "float", nullable: true })
  public turnover_ref_categorie!: number;
}

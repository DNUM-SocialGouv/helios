import { Entity, PrimaryColumn, Column, Index, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionGroupeModel } from "./referentiel/VigieRhRefProfessionGroupeModel";

@Entity("vigie_rh_profession_groupe")
@Index("idx_profession", ["profession"])
export class VigieRhProfessionGroupeModel {
  @PrimaryColumn({ type: "varchar", length: 9 })
  public numero_finess!: string;

  @PrimaryColumn()
  public annee!: number;

  @PrimaryColumn()
  public mois!: number;

  @ManyToOne(() => VigieRhRefProfessionGroupeModel, { nullable: true })
  @JoinColumn({ name: "profession" })
  public profession!: VigieRhRefProfessionGroupeModel;

  @Column({ type: "int", nullable: true })
  public effectif!: number;

  @Column({ type: "varchar", length: 2, nullable: true })
  public indic_qualite_effectif!: string;

  @Column({ type: "varchar", length: 2, nullable: true })
  public indic_redressement_effectif!: string;

  @Column({ type: "varchar", length: 2, nullable: true })
  public indic_masque_secret_effectif!: string;
}
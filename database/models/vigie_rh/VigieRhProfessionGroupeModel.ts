import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionGroupeModel } from "./referentiel/VigieRhRefProfessionGroupeModel";

@Entity("vigie_rh_profession_groupe")
export class VigieRhProfessionGroupeModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @PrimaryColumn({ type: "int", name: "profession" })
  public professionId!: number;

  @ManyToOne(() => VigieRhRefProfessionGroupeModel, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: "profession" })
  public readonly profession!: VigieRhRefProfessionGroupeModel;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number | null;

  @Column({ type: "varchar", length: 2, nullable: true, name: "indic_qualite_effectif" })
  public indicQualiteEffectif!: string | null;

  @Column({ type: "varchar", length: 2, nullable: true, name: "indic_redressement_effectif" })
  public indicRedressementEffectif!: string | null;

  @Column({ type: "varchar", length: 2, nullable: true, name: "indic_masque_secret_effectif" })
  public indicMasqueSecretEffectif!: string | null;
}

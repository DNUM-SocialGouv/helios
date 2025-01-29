import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefTypeContratModel } from "./referentiel/VigieRhRefTypeContratModel";

@Entity("vigie_rh_contrat")
export class VigieRhContratModel {
  @PrimaryColumn({ type: "varchar", length: 9 })
  public numero_finess!: string;

  @PrimaryColumn()
  public annee!: number;

  @PrimaryColumn()
  public mois!: number;

  @ManyToOne(() => VigieRhRefTypeContratModel, { nullable: true })
  @JoinColumn({ name: "type_contrat" })
  public type_contrat!: VigieRhRefTypeContratModel;

  @Column({ type: "int", nullable: true })
  public effectif!: number;
}

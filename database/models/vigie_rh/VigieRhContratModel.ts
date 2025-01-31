import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefTypeContratModel } from "./referentiel/VigieRhRefTypeContratModel";

@Entity("vigie_rh_contrat")
export class VigieRhContratModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @PrimaryColumn({ type: "int", name: "type_contrat" })
  public typeContratId!: number;

  @ManyToOne(() => VigieRhRefTypeContratModel, { nullable: false, eager: true })
  @JoinColumn({ name: "type_contrat" })
  public readonly typeContrat!: VigieRhRefTypeContratModel;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number;
}

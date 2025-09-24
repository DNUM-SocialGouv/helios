import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefTypeContratModel } from "./referentiel/VigieRhRefTypeContratModel";

@Entity("vigierh_contrat")
export class VigieRhContratModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @ManyToOne(() => VigieRhRefTypeContratModel, { eager: true })
  @JoinColumn({ name: "type_contrat_code", referencedColumnName: "code" })
  public readonly typeContrat!: VigieRhRefTypeContratModel;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number | null;
}

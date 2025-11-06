import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefMotifRuptutreContratModel } from "./referentiel/VigieRhRefMotifRuptureContratModel";

@Entity("vigierh_motifs_ruptures")
export class VigieRhMotifRuptutreContratModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "finess_et" })
  public numeroFinessET!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "trimestre" })
  public trimestre!: number;

  @PrimaryColumn({ type: "int", name: "motif_code" })
  public motifCode!: number;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number;

  @Column({ type: "int", nullable: true, name: "effectif_ref" })
  public effectifRef!: number;

  @ManyToOne(() => VigieRhRefMotifRuptutreContratModel, { eager: true, nullable: false })
  @JoinColumn({ name: "motif_code", referencedColumnName: "code" })
  public readonly motifRuptureRef!: VigieRhRefMotifRuptutreContratModel;
}

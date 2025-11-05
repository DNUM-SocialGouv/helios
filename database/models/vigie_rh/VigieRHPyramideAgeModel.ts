import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefTrancheAgeModel } from "./referentiel/VigieRhRefTrancheAgeModel";

@Entity("vigierh_pyramide")
export class VigieRhPyramideAgesModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess_etablissement_territorial" })
  public numeroFinessET!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "tranche_code" })
  public trancheCode!: number;

  @Column({ type: "int", nullable: true, name: "effectif_homme" })
  public effectifHomme!: number;

  @Column({ type: "int", nullable: true, name: "effectif_femme" })
  public effectifFemme!: number;

  @Column({ type: "int", nullable: true, name: "effectif_homme_ref" })
  public effectifHommeRef!: number;

  @Column({ type: "int", nullable: true, name: "effectif_femme_ref" })
  public effectifFemmeRef!: number;

  @ManyToOne(() => VigieRhRefTrancheAgeModel, { eager: true, nullable: false })
  @JoinColumn({ name: "tranche_code", referencedColumnName: "codeTrancheAge" })
  public readonly trancheAgeRef!: VigieRhRefTrancheAgeModel;
}

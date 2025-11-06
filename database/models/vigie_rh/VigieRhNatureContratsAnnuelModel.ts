import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { VigieRhRefNatureContrat } from "./referentiel/VigieRhRefNatureContratsModel";

@Entity("vigierh_nature_contrats_annuel")
export class VigieRhNatureContratsAnnuelModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess_etablissement_territorial" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "nature_contrat_code" })
  public natureCode!: number;

  @ManyToOne(() => VigieRhRefNatureContrat, { eager: true })
  @JoinColumn({ name: "nature_contrat_code", referencedColumnName: "code" })
  public nature!: VigieRhRefNatureContrat;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number | null;

  @Column({ type: "int", nullable: true, name: "effectif_ref" })
  public effectifRef!: number | null;
}

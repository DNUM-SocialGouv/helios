import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefDureeCddModel } from "./referentiel/VigieRhRefDureeCddModel";

@Entity("vigierh_duree_cdd")
export class VigieRhDureesCDDModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess_etablissement_territorial" })
  public numeroFinessET!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "trimestre" })
  public trimestre!: number;

  @PrimaryColumn({ type: "int", name: "duree_code" })
  public dureeCode!: number;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number;

  @Column({ type: "int", nullable: true, name: "effectif_ref" })
  public effectifRef!: number;

  @ManyToOne(() => VigieRhRefDureeCddModel, { eager: true, nullable: false })
  @JoinColumn({ name: "duree_code", referencedColumnName: "dureeCode" })
  public readonly dureeCddRef!: VigieRhRefDureeCddModel;
}

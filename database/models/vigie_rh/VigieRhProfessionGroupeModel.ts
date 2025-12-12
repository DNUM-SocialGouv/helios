import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionGroupeModel } from "./referentiel/VigieRhRefProfessionGroupeModel";

@Entity("vigierh_profession_groupe")
export class VigieRhProfessionGroupeModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @PrimaryColumn({ type: "int", name: "profession_code" })
  public professionCode!: number;

  @ManyToOne(() => VigieRhRefProfessionGroupeModel, { eager: true })
  @JoinColumn({ name: "profession_code", referencedColumnName: "code" })
  public readonly profession!: VigieRhRefProfessionGroupeModel;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number | null;
}

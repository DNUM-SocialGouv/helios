import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { VigieRhRefProfessionFiliereModel } from "./referentiel/VigieRhRefProfessionFiliereModel";

@Entity("vigierh_profession_filiere")
export class VigieRhProfessionFiliereModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @PrimaryColumn({ type: "int", name: "profession_code" })
  public professionCode!: number;

  @Column({ type: "int", name: "quarter", nullable: false })
  public quarter!: number;

  @ManyToOne(() => VigieRhRefProfessionFiliereModel, { eager: true })
  @JoinColumn({ name: "profession_code", referencedColumnName: "code" })
  public readonly profession!: VigieRhRefProfessionFiliereModel;

  @Column({ type: "int", name: "effectif_filiere", nullable: true })
  public effectifFiliere?: number;

  @Column({ type: "int", name: "effectif_etab", nullable: true })
  public effectifEtab?: number;
}

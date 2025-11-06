import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionFiliereModel } from "./VigieRhRefProfessionFiliereModel";

@Entity("vigierh_ref_profession_groupe")
export class VigieRhRefProfessionGroupeModel {
  @PrimaryColumn({ type: "int", name: "code" })
  public code!: number;

  @Column({ type: "varchar", length: 255, nullable: true, name: "label" })
  public label!: string | null;

  @ManyToOne(() => VigieRhRefProfessionFiliereModel, { eager: true, nullable: true })
  @JoinColumn({ name: "code_filiere", referencedColumnName: "code" })
  public readonly filiere!: VigieRhRefProfessionFiliereModel | null;
}

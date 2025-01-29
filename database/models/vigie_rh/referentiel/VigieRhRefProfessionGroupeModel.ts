import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("vigie_rh_ref_profession_groupe")
export class VigieRhRefProfessionGroupeModel {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  public label!: string;
}

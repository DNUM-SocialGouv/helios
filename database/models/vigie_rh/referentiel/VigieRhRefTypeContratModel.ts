import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("vigie_rh_ref_type_contrat")
export class VigieRhRefTypeContratModel {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  public label!: string;
}

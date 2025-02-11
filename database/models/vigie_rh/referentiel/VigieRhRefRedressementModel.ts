import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("vigierh_ref_redressement")
export class VigieRhRefRedressementModel {
  @PrimaryColumn({ type: "int", name: "code" })
  public code!: number;

  @Column({ type: "varchar", length: 255, nullable: true, name: "label" })
  public label!: string | null;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "institution" })
export class InstitutionModel {
  @PrimaryGeneratedColumn({ name: "inst_id" })
  public id!: number;

  @Column({ name: "inst_code" })
  public code!: string;

  @Column({ name: "inst_code_geo" })
  public codeGeo!: string;

  @Column({ name: "inst_libelle" })
  public libelle!: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "role" })
export class RoleModel {
  @PrimaryGeneratedColumn({ name: "role_id" })
  public id!: number;

  @Column({ name: "role_code" })
  public code!: string;

  @Column({ name: "role_libelle" })
  public libelle!: string;
}

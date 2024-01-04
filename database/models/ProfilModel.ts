import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type ProfileValue = Readonly<{
  institution: { profilEJ: object; profilETSanitaire: object; profilMédicoSocial: object };
  autreRegion: { profilEJ: object; profilETSanitaire: object; profilMédicoSocial: object };
}>;

@Entity({ name: "profil" })
export class ProfilModel {
  @PrimaryGeneratedColumn({ name: "profil_id" })
  public id!: number;

  @Column({ name: "profil_code" })
  public code!: string;

  @Column({ name: "profil_label" })
  public label!: string;

  @Column({ name: "profil_value", type: "jsonb", default: {} })
  public value!: ProfileValue;

  @CreateDateColumn({ name: "profil_date_creation" })
  public dateCreation!: Date;

  @UpdateDateColumn({ name: "profil_date_modification" })
  public dateModification!: Date;
}

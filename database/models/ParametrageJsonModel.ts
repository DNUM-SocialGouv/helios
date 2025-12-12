import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "parametrage_json" })
export class ParametrageJsonModel {
  @PrimaryGeneratedColumn({ name: "parametrage_id" })
  public id!: number;

  @Column({ name: "parametrage_slug", unique: true })
  public slug!: string;

  @Column({ name: "parametrage_contenu", type: "jsonb", default: () => "'{}'::jsonb" })
  public contenu!: Record<string, unknown>;

  @CreateDateColumn({ name: "date_creation", type: "timestamp with time zone", default: () => "now()" })
  public dateCreation!: Date;

  @UpdateDateColumn({ name: "date_derniere_modification", type: "timestamp with time zone", default: () => "now()" })
  public dateDerniereModification!: Date;
}

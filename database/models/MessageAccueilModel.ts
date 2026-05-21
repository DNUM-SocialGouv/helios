import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "message_accueil" })
export class MessageAccueilModel {
  @PrimaryGeneratedColumn({ name: "id" })
  public id!: number;

  @Column({ name: "contenu", length: 255 })
  public contenu!: string;

  @Column({ name: "date_debut", type: "date" })
  public dateDebut!: string;

  @Column({ name: "date_fin", type: "date", nullable: true })
  public dateFin!: string | null;

  @Column({ name: "badge_type", type: "varchar", length: 50, nullable: true })
  public badgeType!: string | null;

  @Column({ name: "badge_libelle", type: "varchar", length: 255, nullable: true })
  public badgeLibelle!: string | null;

  @Column({ name: "date_creation", type: "timestamp", default: () => "now()" })
  public dateCreation!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity({ name: "reclamation" })
@Unique(["id_reclamation"])
export class ReclamationModel {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public id_reclamation!: string;

  @Column({ length: 9 })
  public ndeg_finess_rpps!: string;

  @Column({ default: 0 })
  public annee_de_reception!: number;

  @Column({ default: 0 })
  public encours_total!: number;

  @Column({ default: 0 })
  public encours_motif_10!: number;

  @Column({ default: 0 })
  public encours_motif_11!: number;

  @Column({ default: 0 })
  public encours_motif_12!: number;

  @Column({ default: 0 })
  public encours_motif_13!: number;

  @Column({ default: 0 })
  public encours_motif_14!: number;

  @Column({ default: 0 })
  public encours_motif_15!: number;

  @Column({ default: 0 })
  public encours_motif_16!: number;

  @Column({ default: 0 })
  public encours_motif_17!: number;

  @Column({ default: 0 })
  public encours_motif_18!: number;

  @Column({ default: 0 })
  public encours_motif_19!: number;

  @Column({ default: 0 })
  public encours_motif_155!: number;

  @Column({ default: 0 })
  public encours_motif_156!: number;

  @Column({ default: 0 })
  public clot_total!: number;

  @Column({ default: 0 })
  public clot_motif_10!: number;

  @Column({ default: 0 })
  public clot_motif_11!: number;

  @Column({ default: 0 })
  public clot_motif_12!: number;

  @Column({ default: 0 })
  public clot_motif_13!: number;

  @Column({ default: 0 })
  public clot_motif_14!: number;

  @Column({ default: 0 })
  public clot_motif_15!: number;

  @Column({ default: 0 })
  public clot_motif_16!: number;

  @Column({ default: 0 })
  public clot_motif_17!: number;

  @Column({ default: 0 })
  public clot_motif_18!: number;

  @Column({ default: 0 })
  public clot_motif_19!: number;

  @Column({ default: 0 })
  public clot_motif_155!: number;

  @Column({ default: 0 })
  public clot_motif_156!: number;
}

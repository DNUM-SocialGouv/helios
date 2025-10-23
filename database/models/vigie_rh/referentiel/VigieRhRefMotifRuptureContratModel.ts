import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("vigierh_ref_motifs_ruptures")
export class VigieRhRefMotifRuptutreContratModel {
  @PrimaryColumn({ type: "int", name: "code" })
  public code!: number;

  @Column({ type: "varchar", length: 100, nullable: true, name: "motif" })
  public motif!: string | null;
}

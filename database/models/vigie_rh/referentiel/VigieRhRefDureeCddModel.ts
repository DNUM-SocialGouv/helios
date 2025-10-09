import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("vigierh_referentiel_duree_cdd")
export class VigieRhRefDureeCddModel {
  @PrimaryColumn({ type: "int", name: "duree_code" })
  public dureeCode!: number;

  @Column({ type: "varchar", length: 100, nullable: true, name: "duree" })
  public duree!: string | null;
}

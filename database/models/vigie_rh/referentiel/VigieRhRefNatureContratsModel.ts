import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("vigierh_referentiel_nature_contrat")
export class VigieRhRefNatureContrat {
  @PrimaryColumn({ type: "int", name: "nature_contrat_code" })
  public code!: number;

  @Column({ type: "varchar", name: "nature_contrat" })
  public libelle!: string;
}

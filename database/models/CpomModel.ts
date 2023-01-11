import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "cpom" })
export class CpomModel {
  @Column({ name: "date_d_entree_en_vigueur", nullable: true, type: "date" })
  public dateDEntréeEnVigueur!: string;

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;
}

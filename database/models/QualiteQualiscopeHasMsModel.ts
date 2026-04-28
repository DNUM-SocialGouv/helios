import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "no_data_qualite_has_ms" })
export class QualiteQualiscopeHasMsModel {

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;

}

import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "no_data_qualite_has_et" })
export class QualiteQualiscopeHASModel {

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;


}

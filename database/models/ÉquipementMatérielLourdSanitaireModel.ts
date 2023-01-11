import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { ÉtablissementTerritorialIdentitéModel } from "./ÉtablissementTerritorialIdentitéModel";

@Entity({ name: "equipement_materiel_lourd_sanitaire" })
export class ÉquipementMatérielLourdSanitaireModel {
  @Column({ name: "date_autorisation", nullable: true, type: "date" })
  public dateAutorisation!: string;

  @Column({ name: "date_fin", nullable: true, type: "date" })
  public dateFin!: string;

  @Column({ name: "date_mise_en_oeuvre", nullable: true, type: "date" })
  public dateMiseEnOeuvre!: string;

  @Column({ length: 5, name: "code_equipement_materiel_lourd" })
  public codeÉquipementMatérielLourd!: string;

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "numero_finess_etablissement_territorial", referencedColumnName: "numéroFinessÉtablissementTerritorial" })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel;

  @Column({ length: 255, name: "libelle_eml" })
  public libelléÉquipementMatérielLourd!: string;

  @PrimaryColumn({ length: 31, name: "numero_autorisation_arhgos" })
  public numéroAutorisationArhgos!: string;

  @Column({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;
}

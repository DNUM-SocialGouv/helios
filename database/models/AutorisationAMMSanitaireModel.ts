import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { ÉtablissementTerritorialIdentitéModel } from "./ÉtablissementTerritorialIdentitéModel";

@Entity({ name: "autorisation_sanitaire_amm" })
export class AutorisationAMMSanitaireModel {
  @Column({ length: 2, name: "code_activite" })
  public codeActivité!: string;

  @Column({ name: "date_autorisation", nullable: true, type: "date" })
  public dateAutorisation!: string;

  @Column({ name: "date_fin", nullable: true, type: "date" })
  public dateFin!: string;

  @Column({ name: "date_mise_en_oeuvre", nullable: true, type: "date" })
  public dateMiseEnOeuvre!: string;

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "numero_finess_etablissement_territorial", referencedColumnName: "numéroFinessÉtablissementTerritorial" })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel;

  @Column({ length: 2, name: "code_forme" })
  public codeForme!: string;

  @Column({ length: 255, name: "libelle_activite" })
  public libelléActivité!: string;

  @Column({ length: 255, name: "libelle_forme" })
  public libelléForme!: string;

  @Column({ length: 255, name: "libelle_modalite" })
  public libelléModalité!: string;

  @Column({ length: 2, name: "code_modalite" })
  public codeModalité!: string;

  @PrimaryColumn({ length: 31, name: "numero_autorisation_arhgos" })
  public numéroAutorisationArhgos!: string;

  @Column({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessÉtablissementTerritorial!: string;
}

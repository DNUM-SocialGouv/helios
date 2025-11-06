import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "activite_sanitaire_mensuel" })
export class ActiviteSanitaireMensuelModel {
  @PrimaryColumn({ name: "annee", type: "int" })
  public année!: number;

  @PrimaryColumn({ name: "mois", type: "int" })
  public mois!: number;

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numeroFinessEtablissementTerritorial!: string;

  @Column({ name: "nombre_sejours_partiels_medecine", nullable: true, type: "float" })
  public nombreSéjoursPartielsMédecine!: number;

  @Column({ name: "nombre_sejours_partiels_obstetrique", nullable: true, type: "float" })
  public nombreSéjoursPartielsObstétrique!: number;

  @Column({ name: "nombre_sejours_partiels_chirurgie", nullable: true, type: "float" })
  public nombreSéjoursPartielsChirurgie!: number;

  @Column({ name: "nombre_sejours_complets_medecine", nullable: true, type: "float" })
  public nombreSéjoursCompletsMédecine!: number;

  @Column({ name: "nombre_sejours_complets_obstetrique", nullable: true, type: "float" })
  public nombreSéjoursCompletsObstétrique!: number;

  @Column({ name: "nombre_sejours_complets_chirurgie", nullable: true, type: "float" })
  public nombreSéjoursCompletsChirurgie!: number;

  @Column({ name: "nombre_journees_completes_ssr", nullable: true, type: "float" })
  public nombreJournéesCompletesSsr!: number;

  @Column({ name: "nombre_journees_partiels_ssr", nullable: true, type: "float" })
  public nombreJournéesPartiellesSsr!: number;

  @Column({ name: "nombre_journees_completes_psy", nullable: true, type: "float" })
  public nombreJournéesCompletesPsy!: number;

  @Column({ name: "nombre_journees_partielles_psy", nullable: true, type: "float" })
  public nombreJournéesPartiellesPsy!: number;

  @Column({ name: "duree_moyenne_sejour_medecine", nullable: true, type: "float" })
  public dmsMedecine!: number;

  @Column({ name: "duree_moyenne_sejour_chirurgie", nullable: true, type: "float" })
  public dmsChirurgie!: number;

  @Column({ name: "duree_moyenne_sejour_obstetrique", nullable: true, type: "float" })
  public dmsObstetrique!: number;

}

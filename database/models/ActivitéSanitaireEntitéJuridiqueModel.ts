import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "activite_sanitaire_entite_juridique" })
export class ActivitéSanitaireEntitéJuridiqueModel {
  @PrimaryColumn({ name: "annee", type: "int" })
  public année!: number;

  @PrimaryColumn({ length: 9, name: "numero_finess_entite_juridique" })
  public numéroFinessEntitéJuridique!: string;

  @Column({ name: "nombre_passage_urgence", nullable: true, type: "float" })
  public nombreDePassagesAuxUrgences!: number;

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

  @Column({ name: "nombre_journees_complete_psy", nullable: true, type: "float" })
  public nombreJournéesCompletesPsy!: number;

  @Column({ name: "nombre_journées_partielles_psy", nullable: true, type: "float" })
  public nombreJournéesPartiellesPsy!: number;

  @Column({ name: "nombre_sejours_had", nullable: true, type: "float" })
  public nombreSéjoursHad!: number;
}

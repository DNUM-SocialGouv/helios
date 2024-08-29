import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "activite_sanitaire_mensuel_entite_juridique" })
export class ActivitéSanitaireMensuelEntiteJuridiqueModel {
    @PrimaryColumn({ name: "annee", type: "int" })
    public année!: number;

    @PrimaryColumn({ name: "mois", type: "int" })
    public mois!: number;

    @PrimaryColumn({ length: 9, name: "numero_finess_entite_juridique" })
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

}

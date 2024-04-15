import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "inspections_controles_etablissement_territorial" })
export class InspectionsControlesETModel {

    @PrimaryGeneratedColumn({ name: "inspection_id" })
    public id!: number;

    @Column({ length: 9, name: "numero_finess_etablissement_territorial" })
    public numéroFinessÉtablissementTerritorial!: string;

    @Column({ name: "type_mission" })
    public typeMission!: string;

    @Column({ name: "theme_regional" })
    public themeRegional!: string;

    @Column({ name: "type_plannification" })
    public typePlannification!: string;

    @Column({ name: "date_visite", type: "date" })
    public dateVisite!: string;

    @Column({ name: "date_rapport", type: "date" })
    public dateRapport!: string;

    @Column({ name: "statut_mission" })
    public statutMission!: string;

    @Column({ name: "nombre_ecart" })
    public nombreEcart!: number;

    @Column({ name: "nombre_remarque" })
    public nombreRemarque!: number;

    @Column({ name: "injonction" })
    public injonction!: number;

    @Column({ name: "prescription" })
    public prescription!: number;

    @Column({ name: "recommandation" })
    public recommandation!: number;

    @Column({ name: "saisine_cng" })
    public saisineCng!: number;

    @Column({ name: "saisine_juridiction" })
    public saisineJuridiction!: number;

    @Column({ name: "saisine_parquet" })
    public saisineParquet!: number;

    @Column({ name: "saisine_autre" })
    public saisineAutre!: number;

}
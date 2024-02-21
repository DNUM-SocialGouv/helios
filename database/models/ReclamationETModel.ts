import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "reclamation_etablissement_territorial" })
export class ReclamationETModel {

    @PrimaryColumn({ name: "annee", type: "int" })
    public annee!: number;

    @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
    public numéroFinessÉtablissementTerritorial!: string;

    @Column({ default: 0, name: "encours_total" })
    public encoursTotal!: number;

    @Column({ default: 0, name: "encours_motif_10" })
    public encoursMotif10!: number;

    @Column({ default: 0, name: "encours_motif_11" })
    public encoursMotif11!: number;

    @Column({ default: 0, name: "encours_motif_12" })
    public encoursMotif12!: number;

    @Column({ default: 0, name: "encours_motif_13" })
    public encoursMotif13!: number;

    @Column({ default: 0, name: "encours_motif_14" })
    public encoursMotif14!: number;

    @Column({ default: 0, name: "encours_motif_15" })
    public encoursMotif15!: number;

    @Column({ default: 0, name: "encours_motif_16" })
    public encoursMotif16!: number;

    @Column({ default: 0, name: "encours_motif_17" })
    public encoursMotif17!: number;

    @Column({ default: 0, name: "encours_motif_18" })
    public encoursMotif18!: number;

    @Column({ default: 0, name: "encours_motif_19" })
    public encoursMotif19!: number;

    @Column({ default: 0, name: "encours_motif_155" })
    public encoursMotif155!: number;

    @Column({ default: 0, name: "encours_motif_156" })
    public encoursMotif156!: number;

    @Column({ default: 0, name: "clot_total" })
    public clotTotal!: number;

    @Column({ default: 0, name: "clot_motif_10" })
    public clotMotif10!: number;

    @Column({ default: 0, name: "clot_motif_11" })
    public clotMotif11!: number;

    @Column({ default: 0, name: "clot_motif_12" })
    public clotMotif12!: number;

    @Column({ default: 0, name: "clot_motif_13" })
    public clotMotif13!: number;

    @Column({ default: 0, name: "clot_motif_14" })
    public clotMotif14!: number;

    @Column({ default: 0, name: "clot_motif_15" })
    public clotMotif15!: number;

    @Column({ default: 0, name: "clot_motif_16" })
    public clotMotif16!: number;

    @Column({ default: 0, name: "clot_motif_17" })
    public clotMotif17!: number;

    @Column({ default: 0, name: "clot_motif_18" })
    public clotMotif18!: number;

    @Column({ default: 0, name: "clot_motif_19" })
    public clotMotif19!: number;

    @Column({ default: 0, name: "clot_motif_155" })
    public clotMotif155!: number;

    @Column({ default: 0, name: "clot_motif_156" })
    public clotMotif156!: number;
}
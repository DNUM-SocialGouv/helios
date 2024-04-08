import { Entity, Column, PrimaryColumn } from "typeorm";

export enum EtatSignal {
    EN_COURS = "EN_COURS",
    CLOTURE = "CLOTURE"
}

@Entity({ name: "evenement_indesirable_etablissement_territorial" })
export class EvenementIndesirableETModel {

    @PrimaryColumn({ name: "annee", type: "int" })
    public annee!: number;

    @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
    public numéroFinessÉtablissementTerritorial!: string;

    @Column({ name: "famille_principale" })
    public famillePrincipale!: string;

    @Column({ name: "nature_principale" })
    public naturePrincipale!: string;

    @PrimaryColumn({ length: 6, name: "numero_sivss" })
    public numeroSIVSS!: string;

    @Column({ name: "est_eigs" })
    public isEIGS!: boolean;

    @Column({
        enum: EtatSignal,
        enumName: "etat",
        type: "enum",
    })
    public etat!: EtatSignal;

    @Column({ name: "date_cloture", type: "date" })
    public dateCloture!: string;

    @Column({ name: "motif_cloture" })
    public motifCloture!: string;

}
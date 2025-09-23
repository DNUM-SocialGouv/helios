import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "referentiel_nomenclature_amm" })
export class ReferentielNomenclatureAmm {
    @PrimaryGeneratedColumn({ name: "ref_amm_id" })
    public id!: number;

    @Column({ name: "code_activite" })
    public codeActivite!: string;

    @Column({ name: "libelle_activite" })
    public libelleActivite!: string;


    @Column({ name: "code_modalite" })
    public code_modalite!: string;

    @Column({ name: "libelle_modalite" })
    public libelle_modalite!: string;

    @Column({ name: "code_mention" })
    public code_mention!: string;

    @Column({ name: "libelle_mention" })
    public libelle_mention!: string;

    @Column({ name: "code_pratique_therapeutique_specifique" })
    public codePratiqueTherapeutiqueSpecifique!: string;

    @Column({ name: "libelle_pratique_therapeutique_specifique" })
    public libellePratiqueTherapeutiqueSpecifique!: string;

    @Column({ name: "code_declaration" })
    public codeDeclaration!: string;

    @Column({ name: "libelle_declaration" })
    public libelleDeclaration!: string;

}
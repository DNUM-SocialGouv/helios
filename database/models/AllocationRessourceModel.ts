import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "allocation_ressource_ej" })
export class AllocationRessourceModel {
    @PrimaryColumn({ name: "annee", type: "int" })
    public année!: number;

    @PrimaryColumn({ length: 9, name: "numero_finess_entite_juridique" })
    public numéroFinessEntitéJuridique!: string;

    @Column({ name: "mois", type: "varchar" })
    public mois!: string;

    @Column({ name: "enveloppe", type: "varchar" })
    public enveloppe!: string;

    @Column({ name: "sous_enveloppe", type: "varchar" })
    public sousEnveloppe!: string;

    @Column({ name: "mode_delegation", type: "varchar" })
    public modeDelegation!: string;

    @Column({ name: "montant", type: "float" })
    public montant!: number;
}

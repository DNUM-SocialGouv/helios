import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "allocation_ressource_et" })
export class AllocationRessourceETModel {
    @PrimaryGeneratedColumn({ name: "id" })
    public id!: number;

    @Column({ name: "annee", type: "int" })
    public année!: number;

    @Column({ length: 9, name: "numero_finess_etablissement_territorial" })
    public numeroFinessEtablissementTerritorial!: string;

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

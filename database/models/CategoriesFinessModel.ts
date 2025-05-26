import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "referentiel_categories" })
export class CategoriesFinessModel {
    @PrimaryColumn({ name: "code", type: "varchar" })
    public code!: string;

    @Column({ name: "libelle", type: "varchar" })
    public libelle!: string;

    @Column({ name: "libelle_court", type: "varchar" })
    public libelleCourt!: string;

}

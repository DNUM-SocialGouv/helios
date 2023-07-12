import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { UtilisateurModel } from "./UtilisateurModel";

@Entity({ name: "favori" })
export class FavorisModel {
    @PrimaryGeneratedColumn({ name: "fav_id" })
    public id!: number;

    @Column({ name: "finess_number" })
    public finessNumber!: string;

    @Column({ name: 'type' })
    public type!: string;

    @Column({ name: 'user_id' })
    public userId!: number;

    @ManyToOne(() => UtilisateurModel)
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user!: UtilisateurModel;

}

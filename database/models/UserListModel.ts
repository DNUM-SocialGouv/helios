import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm";

import { UserListEtablissementModel } from "./UserListEtablissementModel";
import { UtilisateurModel } from "./UtilisateurModel";

@Entity({ name: "favori" })
export class UserListModel {
    @PrimaryGeneratedColumn({ name: "list_id" })
    public id!: number;

    @Column({ name: "list_nom" })
    public nom!: string;

    @Column({ name: 'is_favori' })
    public isFavoris!: boolean;

    @Column({ name: 'ut_id' })
    public userId!: string;

    @CreateDateColumn({ name: "date_creation" })
    public dateCreation!: Date;

    @ManyToOne(() => UtilisateurModel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ut_id', referencedColumnName: 'utCode' })
    public user!: UtilisateurModel;

    @OneToMany(() => UserListEtablissementModel, (userListEtablissement) => userListEtablissement.userList)
    public userListEtablissements!: UserListEtablissementModel[];

}

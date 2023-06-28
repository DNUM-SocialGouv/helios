import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  
  import { InstitutionModel } from "./InstitutionModel";
  import { RoleModel } from "./RoleModel";
  
  @Entity({ name: "utilisateur" })
  export class UtilisateurModel {
    @PrimaryGeneratedColumn({ name: "ut_id" })
    public id!: number;
  
    @Column({ name: "ut_code", type: "uuid" })
    public code!: string;
  
    @Column({ name: "ut_nom" })
    public nom!: string;

    @Column({ name: "ut_prenom" })
    public prenom!: string;
  
    @Column({ name: "ut_email" })
    public email!: string;
  
    @ManyToOne(() => InstitutionModel)
    @JoinColumn({ name: "ut_institution", referencedColumnName: "id" })
    public institution!: InstitutionModel;
  
    @Column({ name: "ut_actif", default: false })
    public actif!: boolean;
  
    @ManyToOne(() => RoleModel)
    @JoinColumn({ name: "ut_role", referencedColumnName: "id" })
    public role!: RoleModel;
  
    @Column({ name: "ut_password", nullable: true })
    public password!: string;
  
    @CreateDateColumn({ name: "ut_date_creation" })
    public dateCreation!: Date;
  
    @UpdateDateColumn({ name: "ut_date_modification" })
    public dateModification!: Date;
  
    @Column({ name: "ut_cree_par", nullable: true })
    public creePar!: number;
  
    @Column({ name: "ut_modifie_par", nullable: true })
    public modifiePar!: number;
  }
  
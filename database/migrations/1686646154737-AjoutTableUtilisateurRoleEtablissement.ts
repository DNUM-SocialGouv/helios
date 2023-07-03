import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableUtilisateurRoleEtablissement1686646154737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.institution(
                inst_id bigserial  NOT NULL,
                inst_code character varying(3) NOT NULL,
                inst_libelle character varying(255) NOT NULL,
                PRIMARY KEY (inst_id),
                UNIQUE (inst_code)
            );`);

        await queryRunner.query(`
            CREATE TABLE public.role(
                role_id serial NOT NULL,
                role_code character varying(255) NOT NULL,
                role_libelle character varying(255) NOT NULL,
                PRIMARY KEY (role_id),
                UNIQUE (role_code)
            );`);
        await queryRunner.query(`
            CREATE TABLE public.utilisateur(
                ut_id bigserial NOT NULL,
                ut_code uuid NOT NULL default gen_random_uuid(),
                ut_nom character varying(255) NOT NULL,
                ut_prenom character varying(255),
                ut_email character varying(255) NOT NULL,
                ut_institution bigint NOT NULL,
                ut_actif boolean default false,
                ut_role bigint NOT NULL,
                ut_password varchar(255),
                ut_date_creation timestamp,
                ut_date_modification timestamp,
                ut_cree_par bigint,
                ut_modifie_par bigint,

                PRIMARY KEY (ut_id),
                UNIQUE (ut_code),
                
                constraint ut_role_fk foreign key (ut_role) references public.role(role_id),
                constraint ut_inst_fk foreign key (ut_institution) references public.institution(inst_id)
            );`);

        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('84', 'ARS Auvergne-Rhône-Alpes');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('27', 'ARS Bourgogne-Franche-Comté');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('53', 'ARS Bretagne');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('24', 'ARS Centre-Val de Loire');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('94', 'ARS Corse');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('44', 'ARS Grand Est');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('01', 'ARS Guadeloupe');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('03', 'ARS Guyane');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('32', 'ARS Hauts-de-France');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('11', 'ARS Île-de-France');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('04', 'ARS La Réunion');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('02', 'ARS Martinique');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('06', 'ARS Mayotte');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('28', 'ARS Normandie');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('75', 'ARS Nouvelle-Aquitaine');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('76', 'ARS Occitanie');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('52', 'ARS Pays de la Loire');");
        await queryRunner.query("insert into public.institution(inst_code, inst_libelle) values('93', 'ARS Provence-Alpes-Côte d''Azur');");
        await queryRunner.query("insert into public.role(role_code, role_libelle) values('ADMIN_NAT', 'Admin National');");
        await queryRunner.query("insert into public.role(role_code, role_libelle) values('ADMIN_REG', 'Admin Regional');");
        await queryRunner.query("insert into public.role(role_code, role_libelle) values('USER', 'Utilisateur');");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.utilisateur;
        `);

        await queryRunner.query(`
            DROP TABLE public.role;
        `);

        await queryRunner.query(`
             DROP TABLE public.institution;
        `);
    }

}

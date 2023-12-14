import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableFavori1691393817990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.favori(
                fav_id bigserial NOT NULL,
                user_id uuid NOT NULL,
                type character varying(255) NOT NULL,
                finess_number character varying(255),
                social_reason character varying(255) NOT NULL,
                commune character varying(255) NOT NULL,
                departement character varying(255) NOT NULL,

                PRIMARY KEY (fav_id),
                
                constraint favori_user_id_fkey foreign key (user_id) references public.utilisateur(ut_code)
            );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.favori;
        `);
    }

}

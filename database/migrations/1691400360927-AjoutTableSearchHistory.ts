import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutTableSearchHistory1691400360927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.search_history(
                id bigserial NOT NULL,
                user_id uuid NOT NULL,
                title character varying(255) NOT NULL,
                finess_number character varying(255) NOT NULL,
                date timestamp NOT NULL,
                type character varying(255) NOT NULL,
                PRIMARY KEY (id),

                constraint search_history_user_id_fkey foreign key (user_id) references public.utilisateur(ut_code)
            );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.search_history;
        `);
    }

}

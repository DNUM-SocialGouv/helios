import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutOrdreRole1720428140655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public.role ADD COLUMN ordre integer;`);

        await queryRunner.query(`UPDATE public.role SET ordre = 1 WHERE role_code = 'ADMIN_NAT';`);
        await queryRunner.query(`UPDATE public.role SET ordre = 2 WHERE role_code = 'ADMIN_REG';`);
        await queryRunner.query(`UPDATE public.role SET ordre = 4 WHERE role_code = 'USER';`);
        await queryRunner.query(`UPDATE public.role SET ordre = 3 WHERE role_code = 'ADMIN_CENTR';`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE public.role DROP COLUMN ordre;`);
    }

}

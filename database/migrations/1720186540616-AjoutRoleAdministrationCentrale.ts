import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutRoleAdministrationCentrale1720186540616 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("insert into public.role(role_code, role_libelle) values('ADMIN_CENTR', 'Administration centrale');");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("delete from public.role where role_code = 'ADMIN_CENTR';");
    }

}

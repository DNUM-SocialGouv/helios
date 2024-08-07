import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutInstitutionAdministrationCentrale1720187617872 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE public.institution ALTER COLUMN inst_code TYPE character varying(15);");
        await queryRunner.query("insert into public.institution(inst_code_geo, inst_libelle, inst_code) values('00', 'Administration centrale', 'ADMIN_CENTR');");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("delete from public.institution where inst_code = 'ADMIN_CENTR';");
    }

}
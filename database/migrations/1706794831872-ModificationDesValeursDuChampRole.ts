import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificationDesValeursDuChampRole1706794831872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE public.role SET role_libelle='Administrateur national' WHERE role_code='ADMIN_NAT';`);
    await queryRunner.query(`UPDATE public.role SET role_libelle='Administrateur régional' WHERE role_code='ADMIN_REG';`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE public.role SET role_libelle='Admin National' WHERE role_code='ADMIN_NAT';`);
    await queryRunner.query(`UPDATE public.role SET role_libelle='Admin Regional' WHERE role_code='ADMIN_REG';`);
  }
}

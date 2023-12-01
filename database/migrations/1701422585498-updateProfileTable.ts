import { MigrationInterface, QueryRunner } from "typeorm"

export class updateProfileTable1701422585498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE public.profil
        SET profil_label = 'Consultation des données non sensibles'
        WHERE profil_label = 'Utilisateur lambda'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        TRUNCATE TABLE public.profil`);
    }
}

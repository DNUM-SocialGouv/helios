import { MigrationInterface, QueryRunner } from "typeorm"

export class AjoutRefDepartementRegion1694523233904 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public.referentiel_departement_region(
                ref_id bigserial  NOT NULL,
                ref_code_dep character varying(3) NOT NULL,
                ref_libelle_dep character varying(255) NOT NULL,
                ref_code_region character varying(3) NOT NULL,
                PRIMARY KEY (ref_id),
                UNIQUE (ref_code_dep)
            );`);

        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values('01','84','Ain');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('02','32','Aisne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('03','84','Allier');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('04','93','Alpes-de-Haute-Provence');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('05','93','Hautes-Alpes');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('06','93','Alpes-Maritimes');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('07','84','Ardèche');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('08','44','Ardennes');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('09','76','Ariège');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('10','44','Aube');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('11','76','Aude');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('12','76','Aveyron')");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('13','93','Bouches-du-Rhône');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('14','28','Calvados');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('15','84','Cantal');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('16','75','Charente');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('17','75','Charente-Maritime');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('18','24','Cher');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('19','75','Corrèze');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('21','27', 'Côte-d''Or');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('22','53','Côtes-d''Armor');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('23','75','Creuse');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('24','75','Dordogne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('25','27','Doubs');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('26','84','Drôme');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('27','28','Eure');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('28','24','Eure-et-Loir');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('29','53','Finistère');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('2A','94','Corse-du-Sud');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('2B','94','Haute-Corse');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('30','76','Gard');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('31','76','Haute-Garonne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('32','76','Gers');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('33','75','Gironde');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('34','76','Hérault');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('35','53','Ille-et-Vilaine');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('36','24','Indre');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('37','24','Indre-et-Loire');")
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('38','84','Isère');");;
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('39','27','Jura');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('40','75','Landes');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('41','24','Loir-et-Cher');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('42','84','Loire');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('43','84','Haute-Loire');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('44','52','Loire-Atlantique');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('45','24','Loiret');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('46','76','Lot');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('47','75','Lot-et-Garonne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('48','76','Lozère');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('49','52','Maine-et-Loire');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('50','28','Manche');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('51','44','Marne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('52','44','Haute-Marne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('53','52','Mayenne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('54','44','Meurthe-et-Moselle');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('55','44','Meuse');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('56','53','Morbihan');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('57','44','Moselle');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('58','27','Nièvre');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('59','32','Nord');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('60','32','Oise');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('61','28','Orne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('62','32','Pas-de-Calais');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('63','84','Puy-de-Dôme');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('64','75','Pyrénées-Atlantiques');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('65','76','Hautes-Pyrénées');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('66','76','Pyrénées-Orientales');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('67','44','Bas-Rhin');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('68','44','Haut-Rhin');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('69','84','Rhône');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('70','27','Haute-Saône');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('71','27','Saône-et-Loire');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('72','52','Sarthe');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('73','84','Savoie');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('74','84','Haute-Savoie');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('75','11','Paris');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('76','28','Seine-Maritime');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('77','11','Seine-et-Marne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('78','11','Yvelines');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('79','75','Deux-Sèvres');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('80','32','Somme');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('81','76','Tarn');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('82','76','Tarn-et-Garonne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('83','93','Var');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('84','93','Vaucluse');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('85','52','Vendée');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('86','75','Vienne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('87','75','Haute-Vienne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('88','44','Vosges');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('89','27','Yonne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('90','27','Territoire de Belfort');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('91','11','Essonne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('92','11','Hauts-de-Seine');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('93','11','Seine-Saint-Denis');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('94','11','Val-de-Marne');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('95','11','Val-d''Oise');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('971','01','Guadeloupe');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('972','02','Martinique');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('973','03','Guyane');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('974','04','La Réunion');");
        await queryRunner.query("insert into public.referentiel_departement_region(ref_code_dep, ref_code_region, ref_libelle_dep) values ('976','06','Mayotte');");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE public.referentiel_departement_region;
    `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutAideReferentsRegionaux1760448332798 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE public.parametrage_json pj
      SET parametrage_contenu=jsonb_set(parametrage_contenu,
                                       '{kit-du-rfrent-rgional}',
		                                   $$
                                       ${JSON.stringify(AIDE_REF_REGION)}
                                       $$::jsonb)
      WHERE pj.parametrage_slug = 'aide'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE parametrage_json pj
      SET parametrage_contenu=pj.parametrage_contenu - 'kit-du-rfrent-rgional'
      WHERE pj.parametrage_slug = 'aide';
    `);
  }
}

const AIDE_REF_REGION = {
  "icon": "fr-icon-book-2-line",
  "kind": "resources",
  "order": 5,
  "title": "Kit du référent régional",
  "resources": [
    {
      "nom": "Guide du référent régional",
      "type": "document",
      "ordre": 1,
      "contenu": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Guide%20utilisation_R%C3%A9f%C3%A9rents%20R%C3%A9gionaux%2026082025.pdf?csf=1&web=1&e=F6w3Mt",
      "updatedBy": {
        "id": "",
        "nom": "",
        "prenom": ""
      },
      "nom_telechargement": "Guide utilisation_Référents Régionaux 26082025.pdf"
    },
    {
      "nom": "Comment gérer les droits utilisateurs ?",
      "type": "video",
      "ordre": 2,
      "contenu": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/9.Comment%20ajouter%20un%20%C3%A9tablissement%20dans%20une%20liste/9%20Ajouter%20un%20%C3%A9tablissement%20dans%20une%20liste.mp4?csf=1&web=1&e=5mtbqg",
      "updatedBy": {
        "id": "",
        "nom": "",
        "prenom": ""
      }
    }
  ],
  "description": "Pour les administrateurs nationaux et régionaux",
  "allowedRoles": [
    1,
    2
  ]
}


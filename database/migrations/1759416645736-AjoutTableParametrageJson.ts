import { MigrationInterface, QueryRunner } from "typeorm";

export class AjoutTableParametrageJson1759416645736 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.parametrage_json (
        parametrage_id SERIAL PRIMARY KEY,
        parametrage_slug VARCHAR(255) NOT NULL UNIQUE,
        parametrage_contenu JSONB NOT NULL DEFAULT '{}'::jsonb,
        date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        date_derniere_modification TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      INSERT INTO public.parametrage_json (parametrage_slug, parametrage_contenu)
      VALUES (
        'aide',
        $$
        ${JSON.stringify(DEFAULT_JSON)}
        $$::jsonb
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS public.parametrage_json;`);

  }

}


const DEFAULT_JSON = {
  "hlios-en-rgion": {
    "icon": "fr-icon-france-line",
    "kind": "resources",
    "order": 4,
    "title": "Hélios en région",
    "resources": [
      {
        "nom": "Guide du référent régional",
        "type": "document",
        "ordre": 1,
        "contenu": "heliosregion",
        "allowedRoles": [
          2,
          4
        ]
      },
      {
        "nom": "Comment gérer les droits utilisateurs",
        "type": "video",
        "ordre": 2,
        "contenu": "localhost",
        "allowedRoles": [
          2,
          4
        ]
      },
      {
        "nom": "List des référents régionaux",
        "type": "document",
        "ordre": 3,
        "contenu": "https://lien/referents/regionaux"
      }
    ],
    "description": "Section dédiés aux ressources liée à l'utilisation de hélios en région."
  },
  "tutoriels-videos": {
    "icon": "fr-icon-live-line",
    "kind": "resources",
    "order": 2,
    "title": "Tutoriels videos",
    "resources": [
      {
        "nom": "Hélios tutoriel vidéo 1",
        "type": "video",
        "ordre": 1,
        "contenu": "Hélios tutoriel vidéo 1"
      },
      {
        "nom": "Hélios tutoriel vidéo 2",
        "type": "video",
        "ordre": 2,
        "contenu": "Hélios tutoriel vidéo 2"
      },
      {
        "nom": "Hélios tutoriel vidéo 3",
        "type": "video",
        "ordre": 3,
        "contenu": "Hélios tutoriel vidéo 3"
      },
      {
        "nom": "Hélios tutoriel vidéo 4",
        "type": "video",
        "ordre": 4,
        "contenu": "Hélios tutoriel vidéo 4"
      }
    ],
    "description": "Cette section est dédiée à la découverte d'HELIOS à travers des séquences vidéos."
  },
  "guides-utilisation": {
    "icon": "fr-icon-book-2-line",
    "kind": "resources",
    "order": 1,
    "title": "Guides d’utilisation",
    "resources": [
      {
        "nom": "Guide utilisateur",
        "slug": "guide-utilisateur",
        "type": "document",
        "ordre": 1,
        "contenu": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Guide%20utilisateurs%20HeliosUtilisateurs_26082025.pdf?csf=1&web=1&e=6lucf5"
      },
      {
        "nom": "Prise en main rapide -Comparaison",
        "slug": "prise-en-main-rapide-comparaison",
        "type": "document",
        "ordre": 2,
        "contenu": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Prise%20en%20main%20rapide_Helios_Comparaison_0825.pdf?csf=1&web=1&e=4KPq6K"
      },
      {
        "nom": "Prise en main rapide",
        "slug": "prise-en-main-rapide",
        "type": "document",
        "ordre": 3,
        "contenu": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Prise%20en%20main%20rapide_Helios_0825.pdf?csf=1&web=1&e=2I1C1i"
      }
    ],
    "description": "Accédez rapidement à tous les guides Helios."
  },
  "foire-aux-questions": {
    "icon": "fr-icon-question-answer-line",
    "kind": "faq",
    "order": 3,
    "title": "Foire aux questions",
    "resources": [],
    "description": ""
  }
}

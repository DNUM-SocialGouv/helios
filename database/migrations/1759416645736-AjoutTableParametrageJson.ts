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


const DEFAULT_JSON ={
  "documentation": {
    "icon": "fr-icon-book-2-line",
    "type": "resources",
    "order": 1,
    "title": "Documentation",
    "resources": [
      {
        "nom": "Guide utilisateur",
        "type": "document",
        "ordre": 1,
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Guide%20utilisateurs%20HeliosUtilisateurs_26082025.pdf?csf=1&web=1&e=6lucf5",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Prise en main rapide",
        "type": "document",
        "ordre": 2,
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Prise%20en%20main%20rapide_Helios_0825.pdf?csf=1&web=1&e=2I1C1i",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Prise en main rapide -Comparaison",
        "type": "document",
        "ordre": 3,
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Prise%20en%20main%20rapide_Helios_Comparaison_0825.pdf?csf=1&web=1&e=4KPq6K",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Mes référents régionaux",
        "type": "lien",
        "ordre": 4,
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/RdV%20R%C3%A9f%C3%A9rents%20r%C3%A9gionaux/Liste%20des%20r%C3%A9f%C3%A9rents%20r%C3%A9gionaux%20_Dif.pdf?csf=1&web=1&e=94YccM",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      }
    ],
    "description": "Accédez rapidement à tous les guides Helios.",
    "allowedRoles": [
      1,
      2,
      3,
      4
    ]
  },
  "hlios-en-rgion": {
    "icon": "fr-icon-france-line",
    "type": "resources",
    "order": 4,
    "title": "Hélios en région",
    "resources": [
      {
        "nom": "Guide du référent régional",
        "type": "document",
        "ordre": 1,
        "lien": "heliosregion",
        "allowedRoles": [
          2,
          4
        ]
      },
      {
        "nom": "Comment gérer les droits utilisateurs",
        "type": "video",
        "ordre": 2,
        "lien": "localhost",
        "allowedRoles": [
          2,
          4
        ]
      },
      {
        "nom": "List des référents régionaux",
        "type": "document",
        "ordre": 3,
        "lien": "https://lien/referents/regionaux"
      },
      {
        "nom": "Plus d'informations sur HELIOS en région",
        "type": "lien",
        "ordre": 4,
        "lien": "lien",
        "allowedRoles": [
          2,
          4
        ]
      }
    ],
    "description": "Section dédiés aux ressources liée à l'utilisation de hélios en région.",
    "allowedRoles": [
      1,
      2,
      3,
      4
    ]
  },
  "tutoriels-videos": {
    "icon": "fr-icon-live-line",
    "type": "resources",
    "order": 2,
    "title": "Tutoriels videos",
    "resources": [
      {
        "nom": "Comment s’inscrire à Helios?",
        "type": "video",
        "ordre": 1,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/1.%20Comment%20s%27inscrire%20%C3%A0%20Helios/1.comment%20s%27inscrire%20%C3%A0%20H%C3%A9lios.mp4?csf=1&web=1&e=Aqly5f",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment modifier mon mot de passe?",
        "type": "video",
        "ordre": 2,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/2.%20Comment%20modifier%20mon%20mot%20de%20passe/2.Comment%20modifier%20mon%20mot%20de%20passe.mp4?csf=1&web=1&e=br43Hk",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment recherche un établissement? - Recherche simple",
        "type": "video",
        "ordre": 3,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/3.%20Comment%20rechercher%20un%20%C3%A9tablissement%20-%20Recherche%20simple/3.Recherche%20simple.mp4?csf=1&web=1&e=4xq1OJ",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment recherche un établissement? - Recherche avancée",
        "type": "video",
        "ordre": 4,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/4.%20Comment%20rechercher%20un%20%C3%A9tablissement%20-%20Recherche%20avanc%C3%A9e/4.Recherche%20avanc%C3%A9e.mp4?csf=1&web=1&e=FwO5bH",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment exporter une liste?",
        "type": "video",
        "ordre": 5,
        "lien": "https://msociauxfr.sharepoint.com/:f:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/5.%20Comment%20exporter%20une%20liste%20ou%20un%20tableau?csf=1&web=1&e=yyaUTf",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment comparer des établissements?",
        "type": "video",
        "ordre": 6,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/6.%20Comment%20comparer%20les%20%C3%A9tablissements%20m%C3%A9dico-sociaux/6.Comparaison.mp4?csf=1&web=1&e=vEUnvF",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment créer une liste d'établissement?",
        "type": "video",
        "ordre": 7,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/7.%20Comment%20cr%C3%A9er%20une%20liste%20d%27%C3%A9tablissement/7%20Cr%C3%A9er%20une%20liste.mp4?csf=1&web=1&e=3aeQWM",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment gérer une liste d'établissement?",
        "type": "video",
        "ordre": 8,
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/8.%20Comment%20g%C3%A9rer%20une%20liste%20d%27%C3%A9tablissement/8%20G%C3%A8rer%20une%20liste.mp4?csf=1&web=1&e=vMWPc3",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment ajouter un établissement dans une liste?",
        "type": "video",
        "ordre": 9,
        "lien": "https://msociauxfr.sharepoint.com/:f:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/9.Comment%20ajouter%20un%20%C3%A9tablissement%20dans%20une%20liste?csf=1&web=1&e=mfHVvE",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment supprimer un établissement d’une liste?",
        "type": "video",
        "ordre": 10,
        "lien": "https://msociauxfr.sharepoint.com/:f:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/10.Comment%20supprimer%20un%20%C3%A9tablissement%20d%27une%20liste?csf=1&web=1&e=b4Lfl6",
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      }
    ],
    "description": "Cette section est dédiée à la découverte d'HELIOS à travers des séquences vidéos.",
    "allowedRoles": [
      1,
      2,
      3,
      4
    ]
  },
  "foire-aux-questions": {
    "icon": "fr-icon-question-answer-line",
    "type": "faq",
    "order": 3,
    "title": "Foire aux questions",
    "resources": [],
    "description": "Retrouvez les réponses aux questions les plus fréquentes sur Helios. Les rubriques sont mises à jour au fil des retours du terrain."
  }
} 

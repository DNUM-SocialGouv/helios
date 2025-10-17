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
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Guide%20utilisateurs%20HeliosUtilisateurs_26082025.pdf?csf=1&web=1&e=6lucf5",
        "type": "document",
        "ordre": 1,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Prise en main rapide",
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Prise%20en%20main%20rapide_Helios_0825.pdf?csf=1&web=1&e=2I1C1i",
        "type": "document",
        "ordre": 2,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Prise en main rapide -Comparaison",
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Prise%20en%20main%20rapide_Helios_Comparaison_0825.pdf?csf=1&web=1&e=4KPq6K",
        "type": "document",
        "ordre": 3,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Mes référents régionaux",
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/RdV%20R%C3%A9f%C3%A9rents%20r%C3%A9gionaux/Liste%20des%20r%C3%A9f%C3%A9rents%20r%C3%A9gionaux%20_Dif.pdf?csf=1&web=1&e=94YccM",
        "type": "lien",
        "ordre": 4,
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
  "tutoriels-videos": {
    "icon": "fr-icon-live-line",
    "type": "resources",
    "order": 2,
    "title": "Tutoriels videos",
    "resources": [
      {
        "nom": "Comment s’inscrire à Helios?",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/1.%20Comment%20s%27inscrire%20%C3%A0%20Helios/1.comment%20s%27inscrire%20%C3%A0%20H%C3%A9lios.mp4?csf=1&web=1&e=Aqly5f",
        "type": "video",
        "ordre": 1,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment modifier mon mot de passe?",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/2.%20Comment%20modifier%20mon%20mot%20de%20passe/2.Comment%20modifier%20mon%20mot%20de%20passe.mp4?csf=1&web=1&e=br43Hk",
        "type": "video",
        "ordre": 2,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment recherche un établissement? - Recherche simple",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/3.%20Comment%20rechercher%20un%20%C3%A9tablissement%20-%20Recherche%20simple/3.Recherche%20simple.mp4?csf=1&web=1&e=4xq1OJ",
        "type": "video",
        "ordre": 3,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment recherche un établissement? - Recherche avancée",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/4.%20Comment%20rechercher%20un%20%C3%A9tablissement%20-%20Recherche%20avanc%C3%A9e/4.Recherche%20avanc%C3%A9e.mp4?csf=1&web=1&e=FwO5bH",
        "type": "video",
        "ordre": 4,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment exporter une liste?",
        "lien": "https://msociauxfr.sharepoint.com/:f:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/5.%20Comment%20exporter%20une%20liste%20ou%20un%20tableau?csf=1&web=1&e=yyaUTf",
        "type": "video",
        "ordre": 5,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment comparer des établissements?",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/6.%20Comment%20comparer%20les%20%C3%A9tablissements%20m%C3%A9dico-sociaux/6.Comparaison.mp4?csf=1&web=1&e=vEUnvF",
        "type": "video",
        "ordre": 6,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment créer une liste d'établissement?",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/7.%20Comment%20cr%C3%A9er%20une%20liste%20d%27%C3%A9tablissement/7%20Cr%C3%A9er%20une%20liste.mp4?csf=1&web=1&e=3aeQWM",
        "type": "video",
        "ordre": 7,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment gérer une liste d'établissement?",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/8.%20Comment%20g%C3%A9rer%20une%20liste%20d%27%C3%A9tablissement/8%20G%C3%A8rer%20une%20liste.mp4?csf=1&web=1&e=vMWPc3",
        "type": "video",
        "ordre": 8,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment ajouter un établissement dans une liste?",
        "lien": "https://msociauxfr.sharepoint.com/:f:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/9.Comment%20ajouter%20un%20%C3%A9tablissement%20dans%20une%20liste?csf=1&web=1&e=mfHVvE",
        "type": "video",
        "ordre": 9,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        }
      },
      {
        "nom": "Comment supprimer un établissement d’une liste?",
        "lien": "https://msociauxfr.sharepoint.com/:f:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/10.Comment%20supprimer%20un%20%C3%A9tablissement%20d%27une%20liste?csf=1&web=1&e=b4Lfl6",
        "type": "video",
        "ordre": 10,
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
  },
  "kit-du-rfrent-rgional": {
    "icon": "fr-icon-book-2-line",
    "type": "resources",
    "order": 5,
    "title": "Kit du référent régional",
    "resources": [
      {
        "nom": "Guide du référent régional",
        "lien": "https://msociauxfr.sharepoint.com/:b:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Guide%20utilisateurs/Guide%20utilisation_R%C3%A9f%C3%A9rents%20R%C3%A9gionaux%2026082025.pdf?csf=1&web=1&e=F6w3Mt",
        "type": "document",
        "ordre": 1,
        "updatedBy": {
          "id": "",
          "nom": "",
          "prenom": ""
        },
        "nom_telechargement": "Guide utilisation_Référents Régionaux 26082025.pdf"
      },
      {
        "nom": "Comment gérer les droits utilisateurs ?",
        "lien": "https://msociauxfr.sharepoint.com/:v:/r/teams/Helios/Documents%20partages/General/14%20-%20Documentation%20utilisateurs/Vid%C3%A9os/9.Comment%20ajouter%20un%20%C3%A9tablissement%20dans%20une%20liste/9%20Ajouter%20un%20%C3%A9tablissement%20dans%20une%20liste.mp4?csf=1&web=1&e=5mtbqg",
        "type": "video",
        "ordre": 2,
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
}

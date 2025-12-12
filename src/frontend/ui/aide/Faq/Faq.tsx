import Image from "next/image";

import style from "./Faq.module.css";
import "@gouvfr/dsfr/dist/component/accordion/accordion.min.css";
import type { ReactNode } from "react";

type FaqQuestion = Readonly<{
  id: string;
  question: string;
  answer: ReactNode;
}>;

type FaqCategory = Readonly<{
  id: string;
  title: string;
  questions: FaqQuestion[];
}>;

const FAQ_SECTIONS: FaqCategory[] = [
  {
    id: "connexion-utilisateur",
    title: "Connexion à Helios",
    questions: [
      {
        id: "comment-acceder",
        question: "Comment accéder à Helios ?",
        answer: (
          <>
            <p className="fr-mb-2w">
              Helios est accessible uniquement depuis votre ordinateur professionnel, via le VPN de l’ARS ou des Ministères Sociaux.
            </p>
            <p className="fr-mb-0">L’adresse de connexion est: https://www.helios.ars.sante.fr/</p>
          </>
        ),
      },
      {
        id: "navigateur-utiliser",
        question: "Quel navigateur utiliser pour accéder à Helios ?",
        answer: (
          <>
            <p className="fr-mb-2w">Le navigateur internet à privilégier pour accéder à Helios est Microsoft Edge.</p>
            <p className="fr-mb-2w">Google Chrome et Mozilla Firefox sont également fonctionnels.</p>
            <Image alt="" height={40} src="/assets/faq/navigateurs.png" width={160} />
          </>
        ),
      },
      {
        id: "acces-refuse",
        question: "Que signifie le message « Accès refusé » lorsque je me connecte à Helios ?",
        answer: (
          <p className="fr-mb-0">
            Ce message s’affiche si la connexion à Helios est faite depuis un ordinateur non connecté au réseau VPN ARS ou Ministères sociaux.
          </p>
        ),
      },
    ],
  },
  {
    id: "compte-helios",
    title: "Compte Helios",
    questions: [
      {
        id: "compte-inactif",
        question: "Que se passe-t-il si mon compte est inactif ?",
        answer: (
          <>
            <p className="fr-mb-2w">Si vous ne vous êtes pas connecté depuis plus de 6 mois, votre compte devient inactif.</p>
            <p className="fr-mb-1w">Pour le réinitialiser, cliquer sur Mot de passe oublié?</p>
            <p className="fr-mb-1w">Saisissez votre adresse mail puis cliquer sur Confirmer la demande de renouvellement</p>
            <p className="fr-mb-0">Vous recevrez un lien sur votre adresse mail vous invitant à réinitialiser votre mot de passe</p>
          </>
        ),
      },
      {
        id: "format-mot-de-passe",
        question: "Quel est le format attendu pour choisir mon mot de passe ?",
        answer: (
          <>
            <p className="fr-mb-2w">
              Les modalités attendues pour le mot de passe sont au minimum : 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (parmi : !@#$%^&*).
            </p>
            <p className="fr-mb-2w">
              Ces critères sont rappelés sous le champ de saisie de votre mot de passe. Lorsque le format est respecté, les conditions deviennent vertes.
            </p>
            <Image alt="" height={80} src="/assets/faq/criteres_mdp.png" width={154} />
          </>
        ),
      },
    ],
  },
  {
    id: "recherche",
    title: "Recherche",
    questions: [
      {
        id: "resultats-recherche",
        question: "A quoi correspondent les résultats de ma recherche avancée ?",
        answer: (
          <>
            <p className="fr-mb-1w">Lorsque j’effectue une recherche avancée, certains critères ne sont pas cumulatifs.</p>
            <p className="fr-mb-1w">
              Si je sélectionne un ou plusieurs critères dans le filtre Catégorie FINESS alors je ne peux plus accéder au filtre Structure et vice versa.
            </p>
            <p className="fr-mb-1w">
              Les Filtres Zone Géographique et recherche via mot clé ou Numéro FINESS ne feront apparaître que les établissements qui répondent à ces critères cumulés.
            </p>
            <p className="fr-mb-1w">
              Ex: Si dans le filtre Zone Géographique: je choisis “Lyon” et via la zone de recherche par mot clé  je tape “Parc” alors n’apparaîtront dans mon tableau que les établissements de Lyon contenant le mot “Parc” dans leur raison sociale.
            </p>
            <p className="fr-mb-1w">
              Les critères des filtres “Capacité MS” et “Activité SAN” permettent de faire apparaître les établissements qui répondent à l’un OU l’autre des critères choisis.
            </p>
            <p className="fr-mb-0">
              Ex: Via le filtre “Capacité MS” je souhaite rechercher les Etablissements Sociaux et Médico Sociaux de 200 places et plus et via le filtre “Activité SAN” je souhaite rechercher les Etablissements Sanitaires qui ont un nombre de séjours annuel MCO entre 0 et 14000 alors dans mes résultats je retrouverais les établissements MS qui ont 200 places installées et plus ET les établissements sanitaires qui ont un nombre de séjours MCO entre 0 et 14000.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "cartographie",
    title: "Cartographie",
    questions: [
      {
        id: "cartographie-affichage",
        question: "Que faire si la cartographie ne s’affiche pas correctement ?",
        answer: (
          <>
            <p className="fr-mb-1w">La cartographie disponible dans Helios est issue de l’application Atlasanté.</p>
            <p className="fr-mb-2w">
              Si elle ne s’affiche pas ou si un message d’erreur apparait, vérifiez que les cookies tiers Atlasanté sont autorisés dans votre navigateur Internet (pour cela, cliquez sur le symbole de l’œil).
            </p>
            <Image alt="" height={260} src="/assets/faq/cookies.png" width={855} />
            <p className="fr-mt-2w fr-mb-0">Le site helios.ars.sante.fr doit être autorisé.</p>
          </>
        ),
      },
    ],
  },
  {
    id: "fiches-etablissements",
    title: "Fiches établissements",
    questions: [
      {
        id: "aucune-donnee-indicateurs",
        question: "Que signifie le message « Aucune donnée n’est renseignée pour les indicateurs suivants »",
        answer: (
          <p className="fr-mb-0">
            Ce message signifie qu’aucune donnée n’est à date transmise et/ou disponible dans les bases de données Helios pour les indicateurs visualisés.
          </p>
        ),
      },
      {
        id: "aucune-donnee-etablissement",
        question: "Que signifie le message « Aucune donnée pour cet établissement ?",
        answer: (
          <p className="fr-mb-0">Ce message signifie qu’aucune donnée n’a à date été transmise pour l’établissement consulté.</p>
        ),
      },
      {
        id: "pas-autorise",
        question: "Que signifie le message « Vous n’êtes pas autorisé à consulter les indicateurs suivants » ?",
        answer: (
          <>
            <p className="fr-mb-1w">
              Ce message apparaît lorsque votre profil utilisateur ne dispose pas des droits nécessaires à la visualisation de ces données. Veuillez-vous rapprocher de votre référent régional le cas échéant.
            </p>
            <p className="fr-mb-0">Ce message apparaît également lorsque vous consultez la fiche d’un établissement qui n’est pas dans votre région.</p>
          </>
        ),
      },
      {
        id: "types-fiches",
        question: "Quels types de fiches établissements sont disponibles dans Helios ?",
        answer: (
          <>
            <p className="fr-mb-1w">Il existe trois types de fiches établissements dans Helios&nbsp;:</p>
            <ul className="fr-list fr-pl-4w fr-mb-0">
              <li>Fiche Etablissement Juridique</li>
              <li>Fiche Etablissement Territorial Sanitaire</li>
              <li>Fiche Etablissement Territorial Medico Social</li>
            </ul>
          </>
        ),
      },
      {
        id: "sources-donnees",
        question: "D’où proviennent les données disponibles dans Helios ?",
        answer: (
          <>
            <p className="fr-mb-2w">Les sources des données disponibles dans Helios sont indiquées sous chaque intitulé d’indicateur.</p>
            <Image alt="" height={23} src="/assets/faq/source.png" width={72} />
          </>
        ),
      },
      {
        id: "maj-donnees",
        question: "Quand sont mises à jour les données disponibles dans Helios ?",
        answer: (
          <>
            <p className="fr-mb-2w">
              La dernière date de mise à jour des données disponibles dans Helios, est indiquée sous chaque intitulé d’indicateur.
            </p>
            <Image alt="" height={29} src="/assets/faq/date_maj.png" width={152} />
          </>
        ),
      },
      {
        id: "calcul-donnees",
        question: "Comment sont calculées les données disponibles dans Helios ?",
        answer: (
          <>
            <p className="fr-mb-2w">
              Les méthodologies de calcul et détail des données disponibles dans Helios, sont accessibles en cliquant sur le bouton .
            </p>
            <Image alt="" height={17} src="/assets/faq/details.png" width={63} />
          </>
        ),
      },
      {
        id: "blocs-disponibles",
        question: "Les fiches disponibles contiennent-elles toutes les mêmes blocs ?",
        answer: (
          <>
            <p className="fr-mb-2w">Certains blocs sont communs à tous les établissements, d’autres sont spécifiques.</p>
            <p className="fr-mb-1w">Sur les fiches Entités Juridiques je retrouve les blocs :</p>
            <ul className="fr-list fr-pl-4w fr-mb-2w">
              <li>Capacité et autorisation</li>
              <li>Activité</li>
              <li>Ressources Humaines</li>
              <li>Budget et Finances</li>
            </ul>
            <p className="fr-mb-1w">Sur les fiches Etablissement Sanitaire je retrouve les blocs :</p>
            <ul className="fr-list fr-pl-4w fr-mb-2w">
              <li>Capacité et autorisation</li>
              <li>Activité</li>
              <li>Ressources Humaines (uniquement pour les établissement dépendant EJ ESPIC/EBNL)</li>
              <li>Budget et Finances</li>
              <li>Qualité</li>
            </ul>
            <p className="fr-mb-1w">Sur les fiches Etablissement Médico-social je retrouve les blocs:</p>
            <ul className="fr-list fr-pl-4w fr-mb-0">
              <li>Capacité et autorisation</li>
              <li>Activité</li>
              <li>Ressources Humaines</li>
              <li>Budget et Finances</li>
              <li>Qualité</li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: "documentation",
    title: "Documentation",
    questions: [
      {
        id: "documentation",
        question: "Où trouver la documentation relative à l’application Helios ?",
        answer: (
          <>
            <p className="fr-mb-1w">Vous pouvez trouver la documentation depuis :</p>
            <p className="fr-mb-1w">- l’application Helios en vous rendant dans le menu Aide puis Guide utilisateurs ou Vidéos tutoriels</p>
            <p className="fr-mb-0">
              - l’espace Teams Utilisateur dans le dossier « Guide », en adressant une demande auprès du support au mail suivant : dnum.scn-helios-support@sg.social.gouv.fr.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "referents",
    title: "Référents",
    questions: [
      {
        id: "referent-region",
        question: "Qui est le référent de ma région ?",
        answer: (
          <>
            <p className="fr-mb-1w">Vous pouvez retrouver les noms et contact du référent de votre région en vous rendant :</p>
            <ul className="fr-list fr-pl-4w fr-mb-0">
              <li>Dans le dossier “Référents régionaux “ sur le Teams Utilisateurs</li>
              <li>Dans le Menu Aide de l’application Helios.</li>
            </ul>
          </>
        ),
      },
      {
        id: "suggestion",
        question: "Comment partager une suggestion, anomalie, question au sujet de l’application ?",
        answer: (
          <p className="fr-mb-0">
            Vous pouvez vous adresser à votre référent régional. Il saura vous orienter en fonction de la nature de votre demande.
          </p>
        ),
      },
    ],
  },
];

const renderAnswer = (answer: FaqQuestion["answer"]) => {
  return <div className="fr-mb-0">{answer}</div>;
};

export default function Faq() {
  return (
    <section>
      {FAQ_SECTIONS.map((category) => {
        const categoryId = `faq-category-${category.id}`;
        return (
          <section className="fr-accordion" key={category.id}>
            <h2 className="fr-accordion__title">
              <button aria-controls={categoryId} aria-expanded={true} className="fr-accordion__btn" type="button">
                {category.title}
              </button>
            </h2>
            <div className="fr-collapse fr-collapse--expanded" id={categoryId}>
              {category.questions.map((question) => {
                const questionId = `${categoryId}-question-${question.id}`;
                return (
                  <section className="fr-accordion " key={question.id}>
                    <h3 className="fr-accordion__title">
                      <button
                        aria-controls={questionId}
                        aria-expanded={false}
                        className="fr-accordion__btn"
                        type="button"
                      >
                        {question.question}
                      </button>
                    </h3>
                    <div className="fr-collapse" id={questionId}>
                      {renderAnswer(question.answer)}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="fr-callout fr-my-8w">
        <p className="fr-callout__title">Besoin d’un accompagnement personnalisé ?</p>
        <p className="fr-callout__text fr-mb-2w">
          Notre équipe support est joignable pour répondre à vos questions et vous guider dans vos démarches.
        </p>
        <div className={`fr-btns-group ${style["center-button-grp"]}`}>
          <a className={`fr-btn fr-btn--secondary ${style["center-button"]}`} href="mailto:dnum.scn-helios-support@sg.social.gouv.fr">
            Contacter notre équipe
          </a>
        </div>
      </div>
    </section >
  );
}

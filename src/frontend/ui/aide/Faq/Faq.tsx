import "@gouvfr/dsfr/dist/component/accordion/accordion.min.css";

type FaqStep = Readonly<{
  title?: string;
  content: string;
}>;

type FaqQuestion = Readonly<{
  id: string;
  question: string;
  answer: string | FaqStep[];
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
        id: "obtenir-acces",
        question: "Comment obtenir mes accès ?",
        answer:
          "Un administrateur national crée votre compte. Vous recevez ensuite un courriel pour initialiser votre mot de passe.",
      },
      {
        id: "navigateur-recommande",
        question: "Quel navigateur est recommandé ?",
        answer:
          "Helios est optimisé pour les versions récentes de Microsoft Edge et Google Chrome.",
      },
      {
        id: "message-acces-refuse",
        question: "Que signifie le message \"Accès refusé\" ?",
        answer:
          "Votre profil ne dispose pas des autorisations nécessaires. Contactez votre référent régional ou le support Helios.",
      },
    ],
  },
  {
    id: "fiches-etablissements",
    title: "Fiches établissements",
    questions: [
      {
        id: "aucune-donnee",
        question: "Pourquoi la fiche affiche \"Aucune donnée\" ?",
        answer:
          "Le flux de données n’a pas encore été publié pour la période sélectionnée. Essayez de consulter une période antérieure.",
      },
      {
        id: "mise-a-jour",
        question: "Quand les données sont-elles mises à jour ?",
        answer:
          "La majorité des indicateurs sont actualisés chaque mois. Les dates précises sont indiquées dans les fiches.",
      },
      {
        id: "sources-donnees",
        question: "D'où proviennent les données affichées ?",
        answer:
          "Les données sont issues des systèmes d'information des ministères sociaux et sont consolidées par la fabrique numérique.",
      },
    ],
  },
  {
    id: "operations-courantes",
    title: "Opérations courantes",
    questions: [
      {
        id: "favoris",
        question: "Comment créer une liste de favoris ?",
        answer:
          "Depuis une fiche, utilisez le bouton \"Ajouter aux favoris\" puis sélectionnez ou créez la liste de destination.",
      },
      {
        id: "export-donnees",
        question: "Comment exporter des données en CSV ?",
        answer: [
          {
            title: "Étape 1 : sélectionner les indicateurs",
            content:
              "Ouvrez l’onglet des indicateurs souhaités et vérifiez que la période est correcte.",
          },
          {
            title: "Étape 2 : lancer l’export",
            content:
              "Cliquez sur \"Exporter\" puis choisissez le format CSV. Le fichier est disponible dans votre navigateur.",
          },
        ],
      },
      {
        id: "support",
        question: "Comment contacter le support Helios ?",
        answer:
          "Utilisez le bouton \"Contacter notre équipe\" en bas de la page ou écrivez à dnum.scn-helios-support@sg.social.gouv.fr.",
      },
    ],
  },
];

const renderAnswer = (questionId: string, answer: FaqQuestion["answer"]) => {
  if (typeof answer === "string") {
    return <p className="fr-mb-0">{answer}</p>;
  }

  return (
    <ul className="fr-list fr-pl-4w fr-mb-0">
      {answer.map((step, index) => (
        <li key={`${questionId}-step-${index}`}>
          {step.title ? <p className="fr-text--bold fr-mb-1v">{step.title}</p> : null}
          <p className="fr-mb-0">{step.content}</p>
        </li>
      ))}
    </ul>
  );
};

export default function Faq() {
  return (
    <section>
      <h1 className="fr-h2 fr-mb-2w">Foire aux questions</h1>
      <p className="fr-text--sm fr-mb-6w">
        Retrouvez les réponses aux questions les plus fréquentes sur Helios. Les rubriques sont mises à jour au fil des
        retours du terrain.
      </p>

      <div className="fr-accordions-group">
        {FAQ_SECTIONS.map((category) => {
          const categoryId = `faq-category-${category.id}`;
          return (
            <section className="fr-accordion fr-mb-3w" key={category.id}>
              <h2 className="fr-accordion__title">
                <button aria-controls={categoryId} aria-expanded={false} className="fr-accordion__btn" type="button">
                  {category.title}
                </button>
              </h2>
              <div className="fr-collapse" id={categoryId}>
                <div className="fr-accordions-group fr-mt-3w fr-ml-2w">
                  {category.questions.map((question) => {
                    const questionId = `${categoryId}-question-${question.id}`;
                    return (
                      <section className="fr-accordion fr-mb-2w" key={question.id}>
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
                          {renderAnswer(question.id, question.answer)}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="fr-callout fr-my-8w">
        <p className="fr-callout__title">Besoin d’un accompagnement personnalisé ?</p>
        <p className="fr-callout__text fr-mb-2w">
          Notre équipe support est joignable pour répondre à vos questions et vous guider dans vos démarches.
        </p>
        <div className="fr-btns-group">
          <a className="fr-btn" href="mailto:dnum.scn-helios-support@sg.social.gouv.fr">
            Contacter notre équipe
          </a>
        </div>
      </div>
    </section>
  );
}

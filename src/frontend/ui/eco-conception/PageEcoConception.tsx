export const PageEcoConception = () => {
  return (
    <>
      <h1>
        Déclaration d’éco-conception <abbr title="Référentiel général d'écoconception de services numériquesx">RGESN</abbr>
      </h1>
      <p>
        <i> Dernière mise à jour : 04 décembre 2023</i>
      </p>
      <p>
        Soucieux d’homogénéiser les pratiques et les SI, le service des systèmes d’information mutualisés des ARS (SCN-SIM) de la DNUM des Ministères Sociaux a
        cherché à équiper les 18 ARS d’une solution simple et unique : <b>Helios</b>.
      </p>
      <p>
        Helios permet de bénéficier d’une vision consolidée et unifiée des données associées aux établissements sanitaires ou médico-sociaux. Ces informations,
        structurées en fiche de synthèse, permettent de situer l’acteur sanitaire ou médico-social dans son environnement.
      </p>
      <p>
        L’équipe a, dès le début du projet, intégré des bonnes pratiques d’écoconception pour le développement de sa plateforme numérique. Cette déclaration
        volontaire a pour objectif de partager et de faire connaître notre démarche afin d’inspirer d’autres entités à s’engager en faveur d’un numérique plus
        responsable.
      </p>
      <h2 className="fr-h6">Les bonnes pratiques que nous avons appliquées :</h2>
      <ol>
        <li className="fr-mb-2w">
          Dès le cadrage, l’équipe de conception et de développement a été sensibilisée aux enjeux environnementaux du numérique et a intégré dans ses rituels,
          ses outils et son pilotage les bonnes pratiques d’éco-conception.
        </li>
        <li className="fr-mb-2w">
          Nous faisons des audits express via&nbsp;
          <a className="fr-link" href="https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=fr">
            Lighthouse
          </a>{" "}
          et l’extension&nbsp;
          <a className="fr-link" href="https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=fr">
            Green IT Analysis
          </a>{" "}
          pour identifier rapidement les leviers d’optimisation en écodéveloppement et intégration au backlog.
        </li>
        <li className="fr-mb-2w">
          Helios a une retro compatibilité de cinq ans pour éviter de contribuer au renouvellement des équipements numériques. <br />
          Quelques indications sur les configurations minimales supportées par le service :
          <ul>
            <li>Le service supporte toutes les versions navigateurs qui ont moins de 5 ans et qui couvrent plus de 0,2% des parts de marché en France</li>
            <li>Le service s’adapte à différentes tailles d’écran jusqu’à 820 px au minimum.</li>
          </ul>
        </li>
        <li className="fr-mb-2w">
          Certains choix d’UX design ont été consciemment pris afin d’améliorer l’expérience utilisateur et de sélectionner uniquement les fonctionnalités les
          plus utiles tout en veillant au respect de la conformité RGAA. Notamment :
          <ul>
            <li>Veiller à la sobriété des pages et parcours avec comme objectif d’arriver en maximum 3 clics à la fonctionnalité principale</li>
            <li>Le téléchargement progressif en fonction de la navigation des éléments de la page et le lancement non automatique des contenus</li>
            <li>Privilégier les médias légers comme les pictos et optimiser les formats</li>
            <li>Aucun tracking non nécessaire ni cookie nécessitant le consentement des utilisateurs</li>
            <li>Utilisation du Système de Design de l’État (DSFR)</li>
          </ul>
        </li>
        <li className="fr-mb-2w">
          Techniquement, des technologies standards ont été utilisées et un travail d’optimisation a été réalisé afin de limiter le nombre de requêtes serveurs
          et réduire les données transférées.
        </li>
      </ol>
      <p className="fr-mb-2w">
        <b>
          En mars 2023, la version du site répond positivement à 85% soit 67 des 79 critères du référentiel général d’éco-conception des services
          numériques&nbsp;
        </b>
        <a
          className="fr-link"
          href="https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/"
          rel="external noopener noreferrer"
          target="_blank"
        >
          (RGESN)
        </a>
        . Ce référentiel a été conçu dans le cadre de la mission interministérielle co-pilotée par la DNUM, le Ministère de la Transition Écologique, l’ADEME et
        l’Institut du Numérique Responsable.
      </p>
      <p className="fr-mb-2w">
        Afin de continuer de maximiser l’impact positif du service numérique et améliorer nos pratiques, nous avons ritualisé le suivi de notre impact
        environnemental afin d’identifier des actions à intégrer au Backlog.
      </p>
    </>
  );
};

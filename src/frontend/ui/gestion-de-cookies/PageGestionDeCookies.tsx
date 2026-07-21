export const PageGestionDeCookies = () => {
  return (
    <>
      <h1>Gestion des Cookies</h1>
      <h2>Pourquoi collecte-t-on des cookies?</h2>
      <p>
        Les cookies nous permettent de vous assurer une bonne expérience de navigation. Si vous l’acceptez, nous utilisons Matomo pour mesurer le trafic,
        l’audience et les pages visitées sur Helios lors de votre visite. Ces cookies de mesure d’audience sont soumis à votre choix dans le bandeau de
        consentement.{" "}
        <a
          className="fr-link"
          href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience"
          rel="external noopener noreferrer"
          target="_blank"
        >
          En savoir plus
        </a>.
      </p>
      <p>
        Il nous permet d’analyser la façon dont vous utilisez le site internet. Les informations collectées anonymement permettent de mieux répondre à vos
        besoins et nous aident à améliorer votre expérience sur Helios. Matomo peut déposer plusieurs cookies techniques et de mesure d’audience selon votre
        navigation, avec une durée de conservation pouvant aller jusqu’à 13 mois.
      </p>
    </>
  );
};

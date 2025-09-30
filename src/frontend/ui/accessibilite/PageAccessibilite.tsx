export const PageAccessibilite = () => {
  return (
    <>
      <h1>Accessibilité</h1>
      <p>
        <i> Dernière mise à jour : 04 décembre 2023</i>
      </p>
      <div className="fr-mb-5w">
        <h2 className="fr-h6">Qu’est-ce que l’accessibilité numérique ?</h2>
        <p>
          Un site web accessible est un site qui permet aux personnes en situation de handicap d’accéder à ses contenus et ses fonctionnalités sans difficulté.
        </p>
        <p>Un site accessible permet par exemple de :</p>
        <ul>
          <li>naviguer avec une synthèse vocale et/ou une plage braille (notamment utilisées par les personnes aveugles et malvoyantes).</li>
          <li>personnaliser l’affichage du site selon ses besoins (grossissement des caractères, modification des couleurs, etc.).</li>
          <li>naviguer sans utiliser la souris (avec le clavier uniquement, via un écran tactile, à la voix ou tout autre périphérique adapté).</li>
        </ul>
      </div>
      <div className="fr-mb-5w">
        <h3 className="fr-h6">Déclaration d’accessibilité</h3>
        <p>Helios s’engage à rendre son site internet accessible conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.</p>
        <p>À cette fin, elle rédige la stratégie et le plan d’action à mettre en œuvre.</p>
        <p>
          Cette déclaration d’accessibilité s’applique à{" "}
          <a className="fr-link" href="https://www.helios.ars.sante.fr/" rel="external noopener noreferrer" target="_blank">
            www.helios.ars.sante.fr/
          </a>
        </p>
      </div>
      <div className="fr-mb-5w">
        <h3 className="fr-h6">État de conformité</h3>
        <p>
          Le site{" "}
          <a className="fr-link" href="https://www.helios.ars.sante.fr/" rel="external noopener noreferrer" target="_blank">
            www.helios.ars.sante.fr/
          </a>{" "}
          est non conforme avec le référentiel général d’amélioration de l’accessibilité (RGAA) car l’audit n’a pas encore été effectué.
        </p>
      </div>
      <div className="fr-mb-5w">
        <h3 className="fr-h6">Retours d’informations et contact</h3>
        <p>
          Vous pouvez nous aider à améliorer l’accessibilité du site en nous signalant les problèmes éventuels que vous rencontrez. Pour ce faire, envoyez-nous
          un courriel à{" "}
          <a
            className="fr-link"
            href="mailto:dnum.scn-helios-support@sg.social.gouv.fr"
            title="Envoyer un email à dnum.scn-helios-support@sg.social.gouv.fr - ouvre un nouvelle fenêtre"
          >
            dnum.scn-helios-support@sg.social.gouv.fr
          </a>
        </p>
      </div>
      <div className="fr-mb-5w">
        <h3 className="fr-h6">Voies de recours</h3>
        <p>
          Si vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail
          et que vous n’avez pas obtenu de réponse satisfaisante, vous pouvez :
        </p>
        <ul>
          <li>
            Écrire un message au Défenseur des droits (<a className="fr-link" href="https://formulaire.defenseurdesdroits.fr/">https://formulaire.defenseurdesdroits.fr/</a>)
          </li>
          <li>
            Contacter le délégué du Défenseur des droits dans votre région (<a className="fr-link" href="https://www.defenseurdesdroits.fr/saisir/delegues">https://www.defenseurdesdroits.fr/saisir/delegues</a>)
          </li>
          <li>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à :</li>

          <address>
            Défenseur des droits
            <br />
            Libre réponse 71120
            <br />
            75342 Paris CEDEX 07
          </address>
        </ul>
      </div>
    </>
  );
};

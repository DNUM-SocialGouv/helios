import { useDependencies } from "../commun/contexts/useDependencies";

export const PageAccessibilite = () => {
    const { wording } = useDependencies();
  return (
    <>
      <h1>Accessibilité</h1>
      <p>
        <b> Dernière mise à jour : 23 novembre 2026</b>
      </p>
      <div className="fr-mb-5w">
        <p>
          <b>Les ministères sociaux </b>s’engagent à rendre leurs sites internet, intranet,   
            extranet et ses progiciels accessibles (et ses applications mobiles et mobilier   
            urbain numérique) conformément à l’article 47 de la loi n°2005-102 du 11 février   
            2005.  
        </p>
        <p>
          À cette fin, ils mettent en œuvre la stratégie et les actions du <a className="fr-link"  href="https://travail-emploi.gouv.fr/schema-pluriannuel-daccessibilite-numerique-2025-2028"  rel="noreferrer" target="_blank" title="https://travail-emploi.gouv.fr/schema-pluriannuel-daccessibilite-numerique-2025-2028 - nouvelle Fenêtre">chéma pluriannuel  
          d’accessibilité numérique 2025-2028 et plan d’actions</a>.
        </p>
        <p>Plan d ‘actions 2027 - 2029 pour le site Helios - fiche de synthèse des données   
          des entités juridiques, et des établissements sanitaires et médico-sociaux :  
        </p>
        <ul>
          <li>Audit initial de conformité du site  </li>
          <li>Prise en compte des corrections à la suite de l’audit initial pour améliorer l’accessibilité du site  </li>
          <li>Contre-audit du site </li>
          <li>Amélioration continue tout au long du cycle de vie du site </li>
        </ul>
        <p>
         Cette déclaration d’accessibilité s’applique au site Helios : <a className="fr-link" 
          href="https://www.helios.ars.sante.fr/" 
          rel="external noopener noreferrer"
          target="_blank" 
          title={`${wording.HELIOS_URL} - ${wording.NOUVELLE_FENÊTRE}`}
          >
            {wording.HELIOS_URL}
          </a>  
        </p>
      </div>
      <div className="fr-mb-5w">
        <h2>État de conformité  </h2>
        <p> <b>Le site Helios</b> est <b>non conforme</b> avec le référentiel général d’amélioration de l’accessibilité (RGAA). Le site n’a pas encore été audité.  </p>
      </div>
      <div className="fr-mb-5w">
        <h2>Établissement de cette déclaration d’accessibilité  </h2>
        <p>Cette déclaration a été établie <b>le 12 octobre 2026</b>.  </p>
      </div>
      <div className="fr-mb-5w">
        <h2>Retour d’information et contact </h2>
        <p>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez   
          contacter le responsable éditorial pour être orienté vers une alternative   
          accessible ou obtenir le contenu sous une autre forme en envoyant un courriel à <a href="mailto:dnum.helios-support@sg.social.gouv.fr" rel="external noopener noreferrer" target="_blank">dnum.helios-support@sg.social.gouv.fr</a>  
        </p>
      </div>
      <div className="fr-mb-5w">
        <h2>Voies de recours  </h2>
        <p>
          Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un   
          contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne   
          parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire   
          parvenir vos doléances ou une demande de saisine au Défenseur des droits.
        </p>
        <p> Plusieurs moyens sont à votre disposition :   </p>
        <ul>
          <li><a 
          className="fr-link"
          href="https://formulaire.defenseurdesdroits.fr/formulaire_saisine/" 
          rel="external noopener noreferrer" 
          target="_blank"
          title={`Écrire un message au Défenseur des droits- ${wording.NOUVELLE_FENÊTRE}`}
          >
            Écrire un message au Défenseur des droits
          </a>
          </li>
          <li>Par courriel : <a className="fr-link" href="mailto:contact@defenseurdesdroits.fr">contact@defenseurdesdroits.fr</a></li>
          <li>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) à : <br/> 
            Défenseur des droits  <br/> 
            Libre réponse 71120  <br/>
            75342 Paris CEDEX 07
          </li>
        </ul>
      </div>
    </>
  );
};

import { useDependencies } from '../commun/contexts/useDependencies'

export const PageDesMentionsLégales = () => {
  const { wording } = useDependencies()
  return (
    <>
      <h1>{wording.MENTIONS_LÉGALES}</h1>
      <p>
        <b>Helios – Fiche de synthèse</b> est mis en œuvre par la direction du numérique des solidarités et de la Santé qui a la charge du pilotage et de la
        mise en œuvre d’un portefeuille de projets <abbr title="Systèmes d’Informations">SI</abbr> mutualisés développés pour le compte de l’ensemble des
        Agences Régionales de Santé.
      </p>
      <section aria-label={wording.ÉDITEUR_DU_SITE}>
        <h2>Éditeur du site</h2>
        <p>
          Le site <a href="www.helios.ars.sante.fr">www.helios.ars.sante.fr</a> est édité par les Ministères des Solidarités et de la Santé - 14 avenue Duquesne
          75007 Paris - 01 40 56 60 00 (standard). Le directeur de publication est Etienne Champion, Secrétaire Général des Ministères Chargés des Affaires
          Sociales (SGMCAS).
        </p>
        <p>
          L’hébergement du site est réalisé par : <br />
          Scalingo SAS <br />
          15 Avenue du Rhin <br />
          67100 Strasbourg <br />
          <a href="https://scalingo.com/fr" rel="external noopener noreferrer" target="_blank">
            scalingo.com
          </a>
        </p>
        <p>
          La réalisation technique du site est réalisée par : <br />
          OCTO TECHNOLOGY <br />
          34 avenue de l’Opéra <br />
          75002 Paris <br />
          <a href="https://www.octo.com/" rel="external noopener noreferrer" target="_blank">
            octo.com
          </a>
        </p>
        <p>
          Pour contacter le webmestre : <a href="mailto:ars-webmestre-tech@ars.sante.fr">ars-webmestre-tech@ars.sante.fr</a>
        </p>
      </section>

      <section aria-label={wording.PROPRIÉTÉ_INTELLECTUELLE}>
        <h2>Propriété intellectuelle</h2>
        <p>
          Sauf mention contraire, tous les contenus de ce site sont sous licence etalab-2.0. Les documents « publics » ou « officiels » ne sont couverts par
          aucun droit d’auteur et peuvent donc être reproduits librement.
          <br />
          Tous les autres contenus présents sur le site sont couverts par le droit d’auteur. Toute reprise est dès lors conditionnée à l’accord de l’auteur en
          vertu de l’article L.122-4 du Code de la propriété intellectuelle. Ces contenus ne sauraient être reproduits librement sans demande préalable et sans
          l’indication de la source.
          <br />
          Les demandes d’autorisation de reproduction d’un contenu doivent être adressées au ministère des solidarités et de la santé (Direction du numérique /{' '}
          <abbr title="Service à Compétence National">SCN</abbr> <abbr title="Systèmes d’Information Mutualisés">SIM</abbr>{' '}
          <abbr title="Agence Régionale de Santé">ARS</abbr> – Tour Mirabeau 39-43 Quai André Citroën 75015 PARIS).
          <br />
          Les reproductions à but commercial ou publicitaire ne seront, sauf exceptions, pas autorisées.
        </p>
      </section>

      <section aria-label={wording.LIMITES_DE_RESPONSABILITÉ}>
        <h2>Limites de responsabilité</h2>
        <h3>Contenus</h3>
        <p>
          Les informations proposées sur ce site le sont à titre de service rendu au public. Malgré tout le soin apporté à la transcription des textes
          officiels, à la vérification des contenus et des informations, les éléments mis en ligne ne sauraient, de quelque manière que ce soit, prétendre à
          l’exactitude et engager la responsabilité du ministère des solidarités et de la santé ou des agences régionales de santé.
          <br />
          Ainsi, l’éditeur du site ne saurait être tenu pour responsable des éventuelles erreurs, interruptions, absence de disponibilité ou inexactitude des
          informations. En conséquence, l’utilisateur du site reconnaît utiliser ces informations sous sa responsabilité exclusive.
          <br />
          Nous vous invitons toutefois à signaler toute erreur sur le site. De plus, les informations et les documents contenus sur le site sont susceptibles de
          faire l’objet de mise à jour à tout moment. Notamment, ils peuvent faire l’objet de mises à jour entre le moment de leur téléchargement par
          l’internaute et celui où il en prend connaissance.
        </p>
        <h3>Liens hypertextes</h3>
        <p>
          La responsabilité de l’éditeur du site ne saurait être engagée au titre du contenu d’un site tiers auquel l’utilisateur a eu accès via un lien
          hypertexte. Inversement, l’éditeur ne peut être tenu responsable des contenus des sites externes qui peuvent contenir des liens hypertextes vers son
          site. Il est interdit d’incorporer le site dans un site tiers en utilisant notamment les procédés de frame et i-frame.
        </p>
        <h3>Utilisation d’Internet</h3>
        <p>
          Par ailleurs, l’utilisateur du site doit disposer des compétences, des matériels et des logiciels requis pour l’utilisation d’Internet. Il reconnaît
          que les caractéristiques et les contraintes d’Internet ne permettent pas de garantir la sécurité, la disponibilité et l’intégrité des transmissions de
          données durant leur transit sur Internet.
        </p>
        <h3>Conditions de bon fonctionnement</h3>
        <p>
          <b>Helios - Fiche de synthèse</b> a été conçu pour fonctionner sur les navigateurs suivants : Google Chrome, Mozilla Firefox, Microsoft Edge.
        </p>
      </section>
    </>
  )
}

import Image from "next/image";

import { Bloc } from "../commun/Bloc/Bloc";
import { useDependencies } from "../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../commun/IndicateurGraphique/IndicateurGraphique";
import { ListItem } from "../commun/ListItem/ListItem";
import { TagMultiNiveauxMock } from "../entité-juridique/bloc-autorisations-capacites/AutorisationsTagMultiNiveaux";
import LogoÉtablissementTerritorialMédicoSocial from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-médico-social-noir.svg";
import LogoÉtablissementTerritorialSanitaire from "../entité-juridique/liste-des-établissements/logo-établissement-territorial-sanitaire-noir.svg";
import LogoEntitéJuridiqueNoir from "../home/logo-entité-juridique-noir.svg";
import styles from "./PageDeRecette.module.css";

export const PageDeRecette = () => {
  const { paths, wording } = useDependencies();

  const entitésJuridiques: { identifiant: string; numéroFiness: string }[] = [
    {
      identifiant: "EJ - 750050759 - CANSSM FILIERIS (avec que des ET sanitaires) - Privé non lucratif",
      numéroFiness: "750050759",
    },
    {
      identifiant: "EJ - 750060758 - SARL DOMITYS NORD OUEST (avec que des ET médico-sociaux) - Privé Lucratif",
      numéroFiness: "750060758",
    },
    {
      identifiant: 'EJ - 500020839 - GCSMS "PRESQU’ÎLE" (sans ET) - Privé non lucratif',
      numéroFiness: "500020839",
    },
    {
      identifiant: "EJ - 750721334 - CROIX ROUGE FRANCAISE (avec beaucoup d’ET) - Privé non lucratif",
      numéroFiness: "750721334",
    },
    {
      identifiant: "EJ - 210012142 - CTRE HOSPITALIER DE LA HAUTE COTE D’OR (avec un nom d’établissement très long) - public",
      numéroFiness: "210012142",
    },
    {
      identifiant: "EJ - 810013144 - SARL EQUI'LIBRE - personne morale droit étranger",
      numéroFiness: "810013144",
    },
  ];
  const établissementsTerritoriauxMédicoSociaux: { identifiant: string; numéroFiness: string }[] = [
    {
      identifiant: "ET - 690024898 - EHPAD SAINT-FRANCOIS D’ASSISE (avec toutes les données d’activités - cadre ERRD)",
      numéroFiness: "690024898",
    },
    {
      identifiant: "ET - 690015458 - ACCUEIL DE JOUR LES PETITS BONHEURS (certains indicateurs ne sont pas disponibles dans les données activité - cadre ERRD)",
      numéroFiness: "690015458",
    },
    {
      identifiant: "ET - 370103137 - ESAT ANAIS DE METTRAY (avec une année manquante dans les données activité - cadre CA PH)",
      numéroFiness: "370103137",
    },
    {
      identifiant: "ET - 130008329 - EHPAD RESIDENCE LES LAVANDINS (avec une année vide dans les données activité - cadre ERRD sans taux)",
      numéroFiness: "130008329",
    },
    {
      identifiant: "ET - 010007425 - SSIAD EHPAD SAINT-TRIVIER-DE-COURTES (avec toutes les données activités disponibles mais vides - cadre ERRD)",
      numéroFiness: "010007425",
    },
    {
      identifiant: "ET - 660011859 - SAAD DOMITYS SUD EST LES TOURS D’OR (avec aucune activité ni données budget et finances)",
      numéroFiness: "660011859",
    },
    {
      identifiant: "ET - 590006961 - INSTITUT THERAPEUTIQUE EDUCATIF ET PEDAGOGIQUE DE TOURCOING (avec beaucoup d’autorisations - cadre CA PH)",
      numéroFiness: "590006961",
    },
    {
      identifiant: "ET - 660009945 - EEPA PHV BOUFFARD VERCELLI (cadre CA PA)",
      numéroFiness: "660009945",
    },
  ];
  const établissementsTerritoriauxMédicoSociauxBudgetEtFinances: { identifiant: string; numéroFiness: string }[] = [
    {
      identifiant: "ET - 690024898 - EHPAD SAINT-FRANCOIS D’ASSISE (2 années ERRD)",
      numéroFiness: "690024898",
    },
    {
      identifiant: "ET - 370103137 - ESAT ANAIS DE METTRAY (2 années CA PH)",
      numéroFiness: "370103137",
    },
    {
      identifiant: "ET - 660009945 - EEPA PHV BOUFFARD VERCELLI (2 années CA PA)",
      numéroFiness: "660009945",
    },
    {
      identifiant: "ET - 010003218 - IME HENRI LAFAY (1 années ERRD et 1 année CA PH)",
      numéroFiness: "010003218",
    },
    {
      identifiant: "ET - 750803553 - RESIDENCE AUTONOMIE ANDRE LEROUX (1 années ERRD et 1 année CA PA)",
      numéroFiness: "750803553",
    },
    {
      identifiant: "ET - 890971294 - SPASAD ATOME AUXERRE (recette négative en 2019)",
      numéroFiness: "890971294",
    },
    {
      identifiant: "ET - 410005946 - SERVICE DE SUITE ET D’ACCOMPAGNEMENT SOCIAL (dépense positive en 2020)",
      numéroFiness: "410005946",
    },
    {
      identifiant: "ET - 130802119 - EHPAD B CARRARA DE L’HOPITAL D’ALLAUCH (sans année)",
      numéroFiness: "130802119",
    },
  ];
  const établissementsTerritoriauxSanitaires: { identifiant: string; numéroFiness: string }[] = [
    {
      identifiant: "ET - 120004668 - CH EMILE BOREL ST AFFRIQUE (avec toutes les données d’activités)",
      numéroFiness: "120004668",
    },
    {
      identifiant: "ET - 780150017 - CTR DE SOINS ET READAPTATION CESSRIN (sans nombres de passages urgences)",
      numéroFiness: "780150017",
    },
    {
      identifiant: "ET - 450000021 - HÔPITAL MADELEINE (sans données MCO)",
      numéroFiness: "450000021",
    },
    {
      identifiant: "ET - 010008852 - CRF L’ORCET SITE DU CH DE FLEYRIAT (avec toutes les données activités disponibles mais vides)",
      numéroFiness: "010008852",
    },
    {
      identifiant: "ET - 830208120 - CDS MEDICAL FILIERIS BRIGNOLES (avec aucune activité)",
      numéroFiness: "830208120",
    },
    {
      identifiant: "ET - 220000012 - CENTRE HOSPITALIER YVES LE FOLL (avec des autorisations et des autres activités)",
      numéroFiness: "220000012",
    },
  ];

  return (
    <main className="fr-container">
      <section aria-label={wording.TITRE_LISTE_DES_ENTITÉS_JURIDIQUES} className="fr-mt-5w">
        <h1 className="fr-h3">{wording.ENTITÉS_JURIDIQUES}</h1>
        <ul className={styles["liste-entités-juridiques"] + " fr-raw-list fr-text--bold fr-raw-link"}>
          {entitésJuridiques.map((entitéJuridique) => (
            <ListItem
              key={entitéJuridique.numéroFiness}
              label={entitéJuridique.identifiant}
              lien={`${paths.ENTITÉ_JURIDIQUE}/${entitéJuridique.numéroFiness}`}
              logo={
                <>
                  <Image alt="" height="22" src={LogoEntitéJuridiqueNoir} width="22" />
                </>
              }
            />
          ))}
        </ul>
      </section>
      <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX} className="fr-mt-5w">
        <h1 className="fr-h3">{wording.ÉTABLISSEMENT_TERRITORIAUX + " Médico-Sociaux"}</h1>
        <ul className={styles["liste-entités-juridiques"] + " fr-raw-list fr-text--bold fr-raw-link"}>
          {établissementsTerritoriauxMédicoSociaux.map((établissementTerritorial) => (
            <ListItem
              key={établissementTerritorial.numéroFiness}
              label={établissementTerritorial.identifiant}
              lien={`${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/${établissementTerritorial.numéroFiness}`}
              logo={
                <>
                  <Image alt="" height="22" src={LogoÉtablissementTerritorialMédicoSocial} width="22" />
                </>
              }
            />
          ))}
        </ul>
        <hr />
        <h2 className="fr-h4">Budget et finances</h2>
        <ul className={styles["liste-entités-juridiques"] + " fr-raw-list fr-text--bold fr-raw-link"}>
          {établissementsTerritoriauxMédicoSociauxBudgetEtFinances.map((établissementTerritorial) => (
            <ListItem
              key={établissementTerritorial.numéroFiness}
              label={établissementTerritorial.identifiant}
              lien={`${paths.ÉTABLISSEMENT_TERRITORIAL_MÉDICO_SOCIAL}/${établissementTerritorial.numéroFiness}`}
              logo={
                <>
                  <Image alt="" height="22" src={LogoÉtablissementTerritorialMédicoSocial} width="22" />
                </>
              }
            />
          ))}
        </ul>
      </section>
      <section aria-label={wording.TITRE_LISTE_DES_ÉTABLISSEMENTS_TERRITORIAUX} className="fr-mt-5w">
        <h1 className="fr-h3">{wording.ÉTABLISSEMENT_TERRITORIAUX + " Sanitaires"}</h1>
        <ul className={styles["liste-entités-juridiques"] + " fr-raw-list fr-text--bold fr-raw-link"}>
          {établissementsTerritoriauxSanitaires.map((établissementTerritorial) => (
            <ListItem
              key={établissementTerritorial.numéroFiness}
              label={établissementTerritorial.identifiant}
              lien={`${paths.ÉTABLISSEMENT_TERRITORIAL_SANITAIRE}/${établissementTerritorial.numéroFiness}`}
              logo={
                <>
                  <Image alt="" height="22" src={LogoÉtablissementTerritorialSanitaire} width="22" />
                </>
              }
            />
          ))}
        </ul>
      </section>
      <br />
      <br />
      <br />
      <br />
      <section>
        <Bloc titre="Test tag multi niveau">
          <ul className="indicateurs">
            <IndicateurGraphique
              contenuInfoBulle={<></>}
              dateDeMiseÀJour="20/20/2022"
              identifiant="test bloc multi niveau"
              nomDeLIndicateur="test bloc multi niveau"
              source={<>toto</>}
            >
              <TagMultiNiveauxMock />
            </IndicateurGraphique>
          </ul>
        </Bloc>
      </section>
    </main>
  );
};

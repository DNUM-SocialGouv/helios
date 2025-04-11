import styles from "./BlocIdentitéSanitaire.module.css";
import { ÉtablissementTerritorialSanitaireIdentitéViewModel } from "./ÉtablissementTerritorialSanitaireIdentitéViewModel";
import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurIdentité } from "../../commun/IndicateurIdentité/IndicateurIdentité";
import { Sources } from "../../commun/Sources/Sources";

type BlocIdentitéSanitaireProps = Readonly<{
  établissementTerritorialSanitaireIdentitéViewModel: ÉtablissementTerritorialSanitaireIdentitéViewModel;
}>;

export const BlocIdentitéSanitaire = ({ établissementTerritorialSanitaireIdentitéViewModel }: BlocIdentitéSanitaireProps) => {
  const { wording } = useDependencies();

  return (
    <Bloc isExpandable={false} isMain={true} titre={wording.TITRE_BLOC_IDENTITÉ}>
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuNomDeLÉtablissementTerritorial}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.nomDeLÉtablissementTerritorial}
        </IndicateurIdentité>

        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourOuvertureÉtablissementTerritorial}
          nomDeLIndicateur={wording.DATE_D_OUVERTURE}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.dateOuvertureÉtablissementTerritorial}
        </IndicateurIdentité>

        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.numéroFinessÉtablissementTerritorial}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuSiret}
          nomDeLIndicateur={wording.SIRET}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.siret}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.adresse}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDutéléphoneEtDeLEmail}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.téléphoneEtEmail}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.entitéJuridiqueDeRattachement}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.catégorieDeLÉtablissement}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuModeDeTarification}
          nomDeLIndicateur={wording.MODE_DE_TARIFICATION}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialSanitaireIdentitéViewModel.modeDeTarification}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialSanitaireIdentitéViewModel.dateDeMiseÀJourDuStatutDeLÉtablissement}
          nomDeLIndicateur={wording.STATUT_JURIDIQUE_EJ}
          source={Sources(wording.FINESS)}
        >
          <>
            {établissementTerritorialSanitaireIdentitéViewModel.statutDeLÉtablissement}<br />
            {établissementTerritorialSanitaireIdentitéViewModel.categorisationDeLEntitéDeRattachement}
          </>
        </IndicateurIdentité>
      </ul>
    </Bloc>
  );
};

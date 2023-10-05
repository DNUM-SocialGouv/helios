import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurIdentité } from "../../commun/IndicateurIdentité/IndicateurIdentité";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import { Sources } from "../../commun/Sources/Sources";
import styles from "./BlocIdentitéMédicoSocial.module.css";
import { ÉtablissementTerritorialMédicoSocialIdentitéViewModel } from "./ÉtablissementTerritorialMédicoSocialIdentitéViewModel";

type BlocIdentitéMédicoSocialProps = Readonly<{
  établissementTerritorialIdentitéMédicoSocialViewModel: ÉtablissementTerritorialMédicoSocialIdentitéViewModel;
}>;

export const BlocIdentitéMédicoSocial = ({ établissementTerritorialIdentitéMédicoSocialViewModel }: BlocIdentitéMédicoSocialProps) => {
  const { wording } = useDependencies();

  return (
    <Bloc isExpandable={false} isMain={true} titre={wording.TITRE_BLOC_IDENTITÉ}>
      {établissementTerritorialIdentitéMédicoSocialViewModel.lesDonnéesIdentitésPasAutorisés.length !== 0 ? <NotAUthorized indicateurs={établissementTerritorialIdentitéMédicoSocialViewModel.lesDonnéesIdentitésPasAutorisés} /> : <></>}
      <ul className={`indicateurs ${styles["liste-indicateurs"]}`}>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuNomDeLÉtablissementTerritorial}
          nomDeLIndicateur={wording.NOM_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.nomDeLÉtablissementTerritorial}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuNuméroFinessÉtablissementTerritorial}
          nomDeLIndicateur={wording.NUMÉRO_FINESS}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.numéroFinessÉtablissementTerritorial}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuSiret}
          nomDeLIndicateur={wording.SIRET}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.siret}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLAdresse}
          nomDeLIndicateur={wording.ADRESSE}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.adresse}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuTéléphoneEtDeLEmail}
          nomDeLIndicateur={wording.TÉLÉPHONE_ET_EMAIL}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.téléphoneEtEmail}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLEntitéJuridiqueDeRattachement}
          nomDeLIndicateur={wording.ENTITÉ_JURIDIQUE_DE_RATTACHEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.entitéJuridiqueDeRattachement}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLaCatégorieDeLÉtablissement}
          nomDeLIndicateur={wording.CATÉGORIE_DE_L_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.catégorieDeLÉtablissement}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuModeDeTarification}
          nomDeLIndicateur={wording.MODE_DE_TARIFICATION}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.modeDeTarification}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuStatutDeLÉtablissement}
          nomDeLIndicateur={wording.STATUT_JURIDIQUE_EJ}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.statutDeLÉtablissement}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuMonoÉtablissement}
          nomDeLIndicateur={wording.MONO_ÉTABLISSEMENT}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.monoÉtablissement}
        </IndicateurIdentité>
        <IndicateurIdentité
          dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDuPrincipalOuDuSecondaire}
          nomDeLIndicateur={wording.ÉTABLISSEMENT_PRINCIPAL_OU_SECONDAIRE}
          source={Sources(wording.FINESS)}
        >
          {établissementTerritorialIdentitéMédicoSocialViewModel.principalOuSecondaire}
        </IndicateurIdentité>
        {établissementTerritorialIdentitéMédicoSocialViewModel.laDateDeLEntréeEnVigueurDuCpomsEstElleAutorisée ? (
          <IndicateurIdentité
            dateDeMiseÀJour={établissementTerritorialIdentitéMédicoSocialViewModel.dateDeMiseÀJourDeLEntréeEnVigueurDuCpom}
            nomDeLIndicateur={wording.DATE_D_ENTRÉE_EN_VIGUEUR_DU_CPOM}
            source={Sources(wording.TDB_PERF)}
          >
            {établissementTerritorialIdentitéMédicoSocialViewModel.dateDeLEntréeEnVigueurDuCpom}
          </IndicateurIdentité>
        ) : <></>}
      </ul>
    </Bloc>
  );
};

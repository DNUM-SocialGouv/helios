import Head from "next/head";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { BlocAutorisationEtCapacitéSanitaire } from "./bloc-autorisations/BlocAutorisationEtCapacitéSanitaire";
import { BlocIdentitéSanitaire } from "./bloc-identité/BlocIdentitéSanitaire";
import BlocQualite from "./bloc-qualite/BlocQualite";
import LogoÉtablissementTerritorial from "./logo-établissement-territorial-sanitaire.svg";
import { ÉtablissementTerritorialSanitaireViewModel } from "./ÉtablissementTerritorialSanitaireViewModel";

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel;
  rechercheViewModel: RechercheViewModel;
}>;

export const PageÉtablissementTerritorialSanitaire = ({ rechercheViewModel, établissementTerritorialSanitaireViewModel }: ÉtablissementTerritorialProps) => {
  const { paths } = useDependencies();

  useBreadcrumb([
    {
      label: établissementTerritorialSanitaireViewModel.titreAccessibleDeLEntitéJuridique,
      path: `${paths.ENTITÉ_JURIDIQUE}/${établissementTerritorialSanitaireViewModel.numéroFinessEntitéJuridiqueBrut}`,
    },
    {
      label: établissementTerritorialSanitaireViewModel.identitéViewModel.nomCourtDeLÉtablissementTerritorial,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{établissementTerritorialSanitaireViewModel.titre}</title>
      </Head>
      <> <Titre logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>{établissementTerritorialSanitaireViewModel.titre}</Titre>
        <BlocIdentitéSanitaire établissementTerritorialSanitaireIdentitéViewModel={établissementTerritorialSanitaireViewModel.identitéViewModel} />
        <BlocAutorisationEtCapacitéSanitaire
          établissementTerritorialSanitaireAutorisationsViewModel={établissementTerritorialSanitaireViewModel.autorisationsViewModel}
        />
        <SeparatorHorizontal></SeparatorHorizontal>
        <BlocActivitéSanitaire établissementTerritorialSanitaireActivitéViewModel={établissementTerritorialSanitaireViewModel.activitésViewModel} />
        <BlocQualite etablissementTerritorialQualiteSanitairelViewModel={établissementTerritorialSanitaireViewModel.qualiteViewModel} />
      </>
    </main>
  );
};


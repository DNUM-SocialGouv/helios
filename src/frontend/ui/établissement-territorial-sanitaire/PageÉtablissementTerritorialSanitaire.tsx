import Head from "next/head";
import { useEffect, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { SeparatorHorizontal } from "../commun/Separateur/SeparatorHorizontal";
import { Titre } from "../commun/Titre/Titre";
import { RechercheViewModel } from "../home/RechercheViewModel";
import { useRecherche } from "../home/useRecherche";
import { BlocActivitéSanitaire } from "./bloc-activité/BlocActivitéSanitaire";
import { BlocAutorisationEtCapacitéSanitaire } from "./bloc-autorisations/BlocAutorisationEtCapacitéSanitaire";
import { BlocIdentitéSanitaire } from "./bloc-identité/BlocIdentitéSanitaire";
import LogoÉtablissementTerritorial from "./logo-établissement-territorial-sanitaire.svg";
import { ÉtablissementTerritorialSanitaireViewModel } from "./ÉtablissementTerritorialSanitaireViewModel";

type ÉtablissementTerritorialProps = Readonly<{
  établissementTerritorialSanitaireViewModel: ÉtablissementTerritorialSanitaireViewModel;
}>;

export const PageÉtablissementTerritorialSanitaire = ({ établissementTerritorialSanitaireViewModel }: ÉtablissementTerritorialProps) => {
  const { paths } = useDependencies();
  const { rechercher, résultats } = useRecherche();
  const [rechercheViewModel, setRechercheViewModel] = useState<RechercheViewModel>();

  useEffect(() => {
    rechercher(établissementTerritorialSanitaireViewModel.numéroFinessEntitéJuridiqueBrut, 1);
  }, [])

  useEffect(() => {
    setRechercheViewModel(résultats[0] as RechercheViewModel);
  }, [résultats])

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
      {rechercheViewModel && (
        <> <Titre logo={LogoÉtablissementTerritorial} rechercheViewModel={rechercheViewModel}>{établissementTerritorialSanitaireViewModel.titre}</Titre>
          <BlocIdentitéSanitaire établissementTerritorialSanitaireIdentitéViewModel={établissementTerritorialSanitaireViewModel.identitéViewModel} />
          <BlocAutorisationEtCapacitéSanitaire
            établissementTerritorialSanitaireAutorisationsViewModel={établissementTerritorialSanitaireViewModel.autorisationsViewModel}
          />
          <SeparatorHorizontal></SeparatorHorizontal>
          <BlocActivitéSanitaire établissementTerritorialSanitaireActivitéViewModel={établissementTerritorialSanitaireViewModel.activitésViewModel} />
        </>
      )}
    </main>
  );
};


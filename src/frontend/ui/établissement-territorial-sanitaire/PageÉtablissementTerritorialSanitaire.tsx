import Head from "next/head";

import { useDependencies } from "../commun/contexts/useDependencies";
import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { Titre } from "../commun/Titre/Titre";
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
      <Titre logo={LogoÉtablissementTerritorial}>{établissementTerritorialSanitaireViewModel.titre}</Titre>
      <BlocIdentitéSanitaire établissementTerritorialSanitaireIdentitéViewModel={établissementTerritorialSanitaireViewModel.identitéViewModel} />
      <BlocAutorisationEtCapacitéSanitaire
        établissementTerritorialSanitaireAutorisationsViewModel={établissementTerritorialSanitaireViewModel.autorisationsViewModel}
      />
      <BlocActivitéSanitaire établissementTerritorialSanitaireActivitéViewModel={établissementTerritorialSanitaireViewModel.activitésViewModel} />
    </main>
  );
};

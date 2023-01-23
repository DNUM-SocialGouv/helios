import Head from "next/head";

import { useBreadcrumb } from "../commun/hooks/useBreadcrumb";
import { Titre } from "../commun/Titre/Titre";
import { EntitéJuridiqueViewModel } from "./EntitéJuridiqueViewModel";
import { BlocIdentité } from "./fiche-d-identité/BlocIdentité";
import { EtablissementsTerritoriauxRattachésViewModel } from "./liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";
import { ListeDesÉtablissementsTerritoriauxRattachés } from "./liste-des-établissements/ListeDesÉtablissementsTerritoriauxRattachés";
import LogoEntitéJuridique from "./logo-entité-juridique.svg";

type EntitéJuridiqueProps = Readonly<{
  entitéJuridiqueViewModel: EntitéJuridiqueViewModel;
  établissementsTerritoriauxRattachésViewModels: EtablissementsTerritoriauxRattachésViewModel;
}>;

export const PageEntitéJuridique = ({ entitéJuridiqueViewModel, établissementsTerritoriauxRattachésViewModels }: EntitéJuridiqueProps) => {
  useBreadcrumb([
    {
      label: entitéJuridiqueViewModel.titreAccessible,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{entitéJuridiqueViewModel.titre}</title>
      </Head>
      <Titre logo={LogoEntitéJuridique}>{entitéJuridiqueViewModel.titre}</Titre>
      <BlocIdentité entitéJuridiqueViewModel={entitéJuridiqueViewModel} />
      <ListeDesÉtablissementsTerritoriauxRattachés établissementsTerritoriauxRattachésViewModels={établissementsTerritoriauxRattachésViewModels} />
    </main>
  );
};

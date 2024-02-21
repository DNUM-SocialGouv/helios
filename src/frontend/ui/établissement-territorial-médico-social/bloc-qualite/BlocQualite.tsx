import { memo } from "react";

import { Bloc } from "../../commun/Bloc/Bloc";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { BlocIndicateurVide } from "../../commun/IndicateurGraphique/BlocIndicateurVide";
import { NoDataCallout } from "../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../commun/notAuthorized/Notauthorized";
import GraphiqueQualite from "../../indicateur-métier/qualite/GraphiqueQualite";
import { ÉtablissementTerritorialQualiteMédicoSocialViewModel } from "./ÉtablissementTerritorialQualiteMédicoSocialViewModel";

type BlocQualitéProps = Readonly<{
  etablissementTerritorialQualiteMédicoSocialViewModel: ÉtablissementTerritorialQualiteMédicoSocialViewModel;
}>;

const BlocQualité = ({ etablissementTerritorialQualiteMédicoSocialViewModel }: BlocQualitéProps) => {
  const { wording } = useDependencies();

  if (
    etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasRenseignées
  ) {
    return <BlocIndicateurVide title={wording.TITRE_BLOC_QUALITE} />;
  }

  return (
    <Bloc titre={wording.TITRE_BLOC_QUALITE}>
      {etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasRenseignees.length !== 0 ? (
        <NoDataCallout indicateurs={etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasRenseignees} />
      ) : etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasAutorisés.length !== 0 ? (
        <NotAUthorized indicateurs={etablissementTerritorialQualiteMédicoSocialViewModel.lesDonnéesQualitePasAutorisés} />
      ) : (
        <></>
      )}

      <ul className="indicateurs">
        {!etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasRenseignées &&
          !etablissementTerritorialQualiteMédicoSocialViewModel.lesReclamationsNeSontPasAutorisées && (
            <GraphiqueQualite
              data={{
                2019: {
                  total_clotures: 389,
                  total_encours: 297,
                  date_miseAJourSource: "20/10/2019",
                  details: [
                    {
                      motif: "MOTIF_10",
                      clot: 10,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_11",
                      clot: 7,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_12",
                      clot: 11,
                      encours: 70,
                    },
                    {
                      motif: "MOTIF_13",
                      clot: 40,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_14",
                      clot: 76,
                      encours: 45,
                    },
                    {
                      motif: "MOTIF_15",
                      clot: 28,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_16",
                      clot: 18,
                      encours: 4,
                    },
                    {
                      motif: "MOTIF_17",
                      clot: 62,
                      encours: 22,
                    },
                    {
                      motif: "MOTIF_18",
                      clot: 1,
                      encours: 9,
                    },
                    {
                      motif: "MOTIF_19",
                      clot: 15,
                      encours: 7,
                    },
                    {
                      motif: "MOTIF_155",
                      clot: 59,
                      encours: 88,
                    },
                    {
                      motif: "MOTIF_156",
                      clot: 62,
                      encours: 12,
                    },
                  ],
                },
                2020: {
                  total_clotures: 1389,
                  total_encours: 797,
                  date_miseAJourSource: "20/10/2020",
                  details: [
                    {
                      motif: "MOTIF_10",
                      clot: 10,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_11",
                      clot: 7,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_12",
                      clot: 11,
                      encours: 170,
                    },
                    {
                      motif: "MOTIF_13",
                      clot: 140,
                      encours: 210,
                    },
                    {
                      motif: "MOTIF_14",
                      clot: 76,
                      encours: 45,
                    },
                    {
                      motif: "MOTIF_15",
                      clot: 28,
                      encours: 10,
                    },
                    {
                      motif: "MOTIF_16",
                      clot: 18,
                      encours: 4,
                    },
                    {
                      motif: "MOTIF_17",
                      clot: 162,
                      encours: 122,
                    },
                    {
                      motif: "MOTIF_18",
                      clot: 101,
                      encours: 109,
                    },
                    {
                      motif: "MOTIF_19",
                      clot: 15,
                      encours: 7,
                    },
                    {
                      motif: "MOTIF_155",
                      clot: 259,
                      encours: 88,
                    },
                    {
                      motif: "MOTIF_156",
                      clot: 562,
                      encours: 12,
                    },
                  ],
                },
              }}
              estEntitéJuridique
              estSanitaire={true}
            />
          )}
      </ul>
    </Bloc>
  );
};

export default memo(BlocQualité);

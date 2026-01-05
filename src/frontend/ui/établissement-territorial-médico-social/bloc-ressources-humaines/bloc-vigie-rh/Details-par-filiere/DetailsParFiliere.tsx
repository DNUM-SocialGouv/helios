import { useMemo } from "react";

import { ProfessionFiliereData, ProfessionGroupeData } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import { BlocVigieRHViewModel } from "../BlocVigieRHViewModel";
import LineChart, { EffectifsData } from "../GraphiqueLine";

type MultiCategorie = ProfessionFiliereData | ProfessionGroupeData;

type DetailsParFiliereProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  couleurEffectifsTotaux: string;
  couleursFilieres: string[];
  paletteGroupes: string[];
  dataEffectifs: EffectifsData;
  multiCategories: MultiCategorie[];
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

export const DetailsParFiliere = ({ etabFiness, etabTitle, couleurEffectifsTotaux, couleursFilieres, paletteGroupes, dataEffectifs, multiCategories, blocVigieRHViewModel }: DetailsParFiliereProps) => {
  const { wording } = useDependencies();
  const filieresAvecGroupes = useMemo(() => blocVigieRHViewModel.filieresAvecGroupes, [blocVigieRHViewModel]);

  const calculateEffectifsData = (filiereCourante: any, groupesCourants: any[]): EffectifsData => {
    if (!filiereCourante) return { dataEtab: [], dataFiliere: [], dataMoisAnnee: [] };
    const serie = filiereCourante?.dataCategorie ?? {};
    let dataMoisAnnee = serie?.dataMoisAnnee ?? [];
    let dataFiliere = serie?.dataFiliere ?? [];

    if ((!dataMoisAnnee?.length || !dataFiliere?.length) && groupesCourants.length > 0) {
      const premiereSerieGroupe = groupesCourants[0]?.dataCategorie ?? {};
      dataMoisAnnee = premiereSerieGroupe?.dataMoisAnnee ?? [];
      dataFiliere = premiereSerieGroupe?.dataFiliere ?? [];
    }

    return {
      dataEtab: dataFiliere ?? [],
      dataFiliere: [],
      dataMoisAnnee: dataMoisAnnee ?? [],
    };
  };

  return (
    <>
      {multiCategories.map((multiCategorie, index) => (
        <div className="fr-grid-row fr-grid-row--gutters" key={index}>
          <div className="fr-col-12 fr-col-md-6 fr-mb-4w">
            <p>{multiCategorie.categorie}</p>
            <LineChart
              classContainer="fr-mb-4w"
              couleurEffectifsTotaux={couleurEffectifsTotaux}
              couleursFilieres={[couleursFilieres[index]]}
              dataEffectifs={dataEffectifs ?? { dataFiliere: [], dataEtab: [], dataMoisAnnee: [] }}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
              identifiantLegende={`légende-graphique-effectif-${index}`}
              identifiantTranscription={`transcription-graphique-effectifs-${index}`}
              multiCategories={[multiCategorie]}
              nomGraph={wording.EFFECTIFS}
            />
          </div>
          <div className="fr-col-12 fr-col-md-6 fr-mb-4w">
            <p>Profession du {multiCategorie.categorie}</p>
            <LineChart
              afficherSerieTotale={false}
              classContainer="fr-mb-4w"
              couleurEffectifsTotaux={couleurEffectifsTotaux}
              couleursFilieres={paletteGroupes}
              dataEffectifs={calculateEffectifsData(multiCategorie.categorie, filieresAvecGroupes[index].groupes?.data ?? [])}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
              identifiantLegende={`légende-graphique-profession-effectif-${index}`}
              identifiantTranscription={`transcription-graphique-profession-effectifs-${index}`}
              legendeCochable={true}
              multiCategories={filieresAvecGroupes[index].groupes?.data ?? []}
              nomGraph={wording.EFFECTIFS}
            />
          </div>
        </div>
      ))}
    </>
  );
};



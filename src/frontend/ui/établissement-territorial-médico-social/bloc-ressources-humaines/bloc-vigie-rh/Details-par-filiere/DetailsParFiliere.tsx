import { ProfessionFiliereData, ProfessionGroupeData } from "../../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../../commun/contexts/useDependencies";
import LineChart, { EffectifsData } from "../GraphiqueLine";

type MultiCategorie = ProfessionFiliereData | ProfessionGroupeData;

type DetailsParFiliereProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  couleurEffectifsTotaux: string;
  couleursFilieres: string[];
  dataEffectifs: EffectifsData;
  multiCategories: MultiCategorie[];
}>;

export const DetailsParFiliere = ({ etabFiness, etabTitle, couleurEffectifsTotaux, couleursFilieres, dataEffectifs, multiCategories }: DetailsParFiliereProps) => {
  const { wording } = useDependencies();

  return (
    <>
      {multiCategories.map((multiCategorie, index) => (
        <div className="fr-grid-row" key={index}>
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
          <div className="fr-col-12 fr-col-md-6 fr-mb-4w"></div>
        </div>
      ))}
    </>
  );
};

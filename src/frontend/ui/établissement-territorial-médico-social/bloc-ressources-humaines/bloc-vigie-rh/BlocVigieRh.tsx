import { useEffect, useState } from "react";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../../commun/notAuthorized/Notauthorized";
import { SeparatorHorizontal } from "../../../commun/Separateur/SeparatorHorizontal";
import { ContenuEffectifs } from "../../InfoBulle/ContenuEffectifs";
import { ContenuPyramideDesAges } from "../../InfoBulle/ContenuPyramideDesAges";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css";
import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import LineChart, { EffectifsData } from "./GraphiqueLine";
import PyramidChart from "./GraphiquePyramide";
import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";

type BlocVigieRHProps = Readonly<{
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({ blocVigieRHViewModel }: BlocVigieRHProps) => {
  if (blocVigieRHViewModel.lesDonneesVgRHPasAutorises.length !== 0) {
    return <NotAUthorized indicateurs={blocVigieRHViewModel.lesDonneesVgRHPasAutorises} />;
  } else if (blocVigieRHViewModel.lesDonneesVgRHPasRenseignees.length !== 0) {
    return <NoDataCallout indicateurs={blocVigieRHViewModel.lesDonneesVgRHPasRenseignees} />;
  } else {
    return <></>;
  }
};

export const BlocVigieRH = ({ blocVigieRHViewModel }: BlocVigieRHProps) => {
  const { wording } = useDependencies();
  const donneesPyramides = blocVigieRHViewModel.lesDonneesPyramideAges;
  const libelles = blocVigieRHViewModel.lesLibellesTranchesAges;
  const annees = donneesPyramides.map((donneeAnnuel) => donneeAnnuel.annee).sort((a, b) => a - b);
  const [anneeEnCours, setAnneeEnCours] = useState<number>(annees[annees.length - 1]);
  const [donneesAnneeEnCours, setDonneesAnneeEnCours] = useState<DonneesVigieRh>();

  const donneesEffectifs = blocVigieRHViewModel.lesDonneesEffectifs;

  const couleurEffectifsTotaux = "#FB8E68"; // orange

  useEffect(() => {
    setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0]);
  }, [anneeEnCours]);

  if (blocVigieRHViewModel.lesDonneesVigieRHNeSontPasRenseignees) {
    return <div>{wording.INDICATEURS_VIDES}</div>;
  }

  // --- helper : aligne sur (année, mois) et somme les filières ---
  function buildTotalsFromCategories(categories: ProfessionFiliereData[]): EffectifsData {
    type MonthYear = { mois: number; annee: number };

    const sumByKey = new Map<string, number>();
    const monthByKey = new Map<string, MonthYear>();

    for (const cat of categories) {
      const moisAnnees = cat?.dataCategorie?.dataMoisAnnee ?? [];
      const valeurs = cat?.dataCategorie?.dataFiliere ?? [];

      const n = Math.min(moisAnnees.length, valeurs.length);
      for (let i = 0; i < n; i++) {
        const m = moisAnnees[i];
        const v = Number(valeurs[i]) || 0;
        const key = `${m.annee}-${String(m.mois).padStart(2, "0")}`;

        monthByKey.set(key, m);
        sumByKey.set(key, (sumByKey.get(key) ?? 0) + v);
      }
    }

    // tri chronologique sur clé YYYY-MM
    const orderedKeys = Array.from(monthByKey.keys()).sort();

    const dataMoisAnnee: MonthYear[] = [];
    const dataEtab: number[] = [];
    for (const k of orderedKeys) {
      dataMoisAnnee.push(monthByKey.get(k)!);
      dataEtab.push(sumByKey.get(k) ?? 0);
    }

    // dataFiliere n’est pas utilisée côté “total”
    return { dataFiliere: [], dataEtab, dataMoisAnnee };
  }

  return (
    <>
      <ListeIndicateursNonAutorisesOuNonRenseignes blocVigieRHViewModel={blocVigieRHViewModel} />

      <ul className={`indicateurs ${styles["liste-indicateurs-vr"]}`}>
        {!blocVigieRHViewModel.lesAgesNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesAgesNeSontIlsPasAutorisee ? (
          <IndicateurGraphique
            années={{ liste: annees, setAnnéeEnCours: setAnneeEnCours }}
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-pyramide-ages"
            nomDeLIndicateur={wording.PYRAMIDE_DES_AGES}
            source={wording.VIGIE_RH}
          >
            <>
              {donneesAnneeEnCours?.effectifFemmeRef &&
                donneesAnneeEnCours?.effectifHomme &&
                donneesAnneeEnCours?.effectifFemme &&
                donneesAnneeEnCours?.effectifHommeRef && (
                  <PyramidChart
                    effectifFemme={donneesAnneeEnCours?.effectifFemme ?? []}
                    effectifFemmeRef={donneesAnneeEnCours?.effectifFemmeRef}
                    effectifHomme={donneesAnneeEnCours?.effectifHomme ?? []}
                    effectifHommeRef={donneesAnneeEnCours?.effectifHommeRef}
                    labels={libelles}
                  />
                )}
            </>
          </IndicateurGraphique>
        ) : (
          <></>
        )}
      </ul>

      {!blocVigieRHViewModel.lesEffectifsNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesEffectifsNeSontIlsPasAutorisee ? (
        <>
          <SeparatorHorizontal></SeparatorHorizontal>
          <IndicateurGraphique
            contenuInfoBulle={<ContenuEffectifs dateDeMiseÀJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs} source={wording.VIGIE_RH} />}
            identifiant="vr-effectifs"
            nomDeLIndicateur={wording.EFFECTIFS}
            source={wording.VIGIE_RH}
          >
            <>
              <div className="fr-grid-row">
                {(() => {
                  const items = donneesEffectifs.data ?? [];
                  const multiCategories = items as ProfessionFiliereData[];
                  const dataEffectifs: EffectifsData = buildTotalsFromCategories(multiCategories);
                  if (!items.length) return null;
                  return (
                    <>
                      <LineChart
                        classContainer="fr-col-6 fr-mb-4w"
                        couleurEffectifsTotaux={couleurEffectifsTotaux}
                        couleursFilieres={["#2A9D8F", "#344966", "#748BAA", "#EDDD79"]}
                        dataEffectifs={dataEffectifs}
                        multiCategories={multiCategories}
                      />
                    </>
                  );
                })()}
              </div>
            </>
          </IndicateurGraphique>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

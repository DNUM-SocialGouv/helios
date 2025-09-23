import { useEffect, useState } from "react";

import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { MOIS } from "../../../../utils/constantes";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../../commun/notAuthorized/Notauthorized";
import { SeparatorHorizontal } from "../../../commun/Separateur/SeparatorHorizontal";
import { ContenuEffectifs } from "../../InfoBulle/ContenuEffectifs";
import { ContenuPyramideDesAges } from "../../InfoBulle/ContenuPyramideDesAges";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css";
import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import CarteIndicateurEffectif from "./CarteIndicateurEffectif";
import GraphiqueDepartEmbauches from "./Depart-embauche/GraphiqueDepartsEmbauches";
import LineChart, { EffectifsData } from "./GraphiqueLine";
import PyramidChart from "./GraphiquePyramide";

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
      const dc: any = (cat as any)?.dataCategorie;
      if (!dc) continue;

      if (Array.isArray(dc)) {
        // format tableau: [{ annee, mois, effectifFiliere/effectif }]
        for (const row of dc) {
          const annee = Number(row?.annee);
          const mois = Number(row?.mois);
          if (!annee || !mois) continue;
          const key = `${annee}-${String(mois).padStart(2, "0")}`;
          monthByKey.set(key, { annee, mois });
          const v = Number(row?.effectifFiliere ?? row?.effectif ?? 0);
          sumByKey.set(key, (sumByKey.get(key) ?? 0) + v);
        }
      } else {
        // format objet: { dataMoisAnnee: [], dataFiliere: [] }
        const moisAnnees = dc?.dataMoisAnnee ?? [];
        const valeurs = dc?.dataFiliere ?? [];
        const n = Math.min(moisAnnees.length, valeurs.length);
        for (let i = 0; i < n; i++) {
          const m = moisAnnees[i];
          const v = Number(valeurs[i]) || 0;
          const key = `${m.annee}-${String(m.mois).padStart(2, "0")}`;
          monthByKey.set(key, m);
          sumByKey.set(key, (sumByKey.get(key) ?? 0) + v);
        }
      }
    }

    const ordered = Array.from(monthByKey.keys()).sort((a, b) => {
      const [ay, am] = a.split("-").map(Number);
      const [by, bm] = b.split("-").map(Number);
      return ay === by ? am - bm : ay - by;
    }); // tri chrono sûr: année puis mois
    const dataMoisAnnee: MonthYear[] = [];
    const dataEtab: number[] = [];
    for (const k of ordered) {
      dataMoisAnnee.push(monthByKey.get(k)!);
      dataEtab.push(sumByKey.get(k) ?? 0);
    }
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
        {!blocVigieRHViewModel.lesDepartsEmbauchesNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesDepartsEmbauchesNeSontIlsPasAutorisee ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-departs-embauches"
            nomDeLIndicateur={wording.DEPARTS_EMBAUCHES}
            source={wording.VIGIE_RH}
          >
            <GraphiqueDepartEmbauches
              donneesDepartsEmbauches={blocVigieRHViewModel.lesDonneesDepartsEmbauches}
              donneesDepartsEmbauchesTrimestriels={blocVigieRHViewModel.donneesDepartsEmbauchesTrimestriels}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}{" "}
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
            <div className="fr-grid-row">
              {(() => {
                // --- Données effectifs ---
                const items = donneesEffectifs.data ?? [];
                if (!items.length) {
                  return <div className="fr-col-12">{wording.INDICATEUR_EFFECTIFS_DONNEES_NON_DISPONIBLE}</div>;
                }
                const multiCategories = items as ProfessionFiliereData[];
                const dataEffectifs: EffectifsData = buildTotalsFromCategories(multiCategories);

                // --- Données iso-période (même mois N-1) à partir des totaux ---
                const mois = dataEffectifs.dataMoisAnnee ?? [];
                const totaux = dataEffectifs.dataEtab ?? [];
                if (!mois.length || !totaux.length) {
                  return <div className="fr-col-12">{wording.INDICATEUR_EFFECTIFS_DONNEES_NON_DISPONIBLE}</div>;
                }

                // dernier point valide
                let last = totaux.length - 1;
                while (last >= 0 && (totaux[last] === null || Number.isNaN(totaux[last] as any))) last--;
                if (last < 0) {
                  return <div className="fr-col-12">{wording.INDICATEUR_EFFECTIFS_DONNEES_NON_DISPONIBLE}</div>;
                }

                const courant = Number(totaux[last]) || 0;
                const ref = mois[last];

                // recherche de l’iso-période (même mois, année-1)
                const isoIdx = mois.findIndex((m) => m.mois === ref.mois && m.annee === ref.annee - 1);
                if (isoIdx < 0) {
                  return <div className="fr-col-12">{wording.INDICATEUR_EFFECTIFS_DONNEES_NON_DISPONIBLE}</div>;
                }
                const precedent = Number(totaux[isoIdx]) || 0;
                const comparaisonLabel = `${MOIS[ref.mois - 1]} ${ref.annee - 1}`;

                return (
                  <>
                    {/* Colonne graphique */}
                    <LineChart
                      classContainer="fr-col-6 fr-mb-4w"
                      couleurEffectifsTotaux={couleurEffectifsTotaux}
                      couleursFilieres={["#2A9D8F", "#344966", "#748BAA", "#EDDD79"]}
                      dataEffectifs={dataEffectifs}
                      multiCategories={multiCategories}
                    />

                    {/* Colonne carte indicateur */}
                    <div className="fr-col-6">
                      <CarteIndicateurEffectif comparaisonLabel={comparaisonLabel} currentValue={courant} previousValue={precedent} />
                    </div>
                  </>
                );
              })()}
            </div>
          </IndicateurGraphique>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

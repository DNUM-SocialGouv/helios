import { useEffect, useMemo, useState } from "react";

import CarteTopIndicateur from "./CarteTopIndicateur";
import GraphiqueDepartEmbauches from "./Depart-embauche/GraphiqueDepartsEmbauches";
import GraphiqueDureeCDD from "./GraphiqueDureeCDD";
import GraphiqueTreemapRepartitionEffectif, { TreemapItem } from "./GraphiqueTreemapRepartitionEffectif";
import GraphiqueTauxRotation from "./Taux-rotation/GraphiqueTauxRotation";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../../commun/NoDataCallout/NoDataCallout";
import { NotAUthorized } from "../../../commun/notAuthorized/Notauthorized";
import { ContenuEffectifs } from "../../InfoBulle/ContenuEffectifs";
import { ContenuPyramideDesAges } from "../../InfoBulle/ContenuPyramideDesAges";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css";
import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import LineChart, { EffectifsData } from "./GraphiqueLine";
import PyramidChart from "./GraphiquePyramide";
import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { MOIS } from "../../../../utils/constantes";
import { StringFormater } from "../../../commun/StringFormater";
import { ContenuRepartitionEffectif } from "../../InfoBulle/ContenuRepartitionEffectif";

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
  const couleursFilieres = ["#2A9D8F", "#344966", "#748BAA", "#EDDD79"]; // réutilisées pour treemap + line

  useEffect(() => {
    setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0]);
  }, [anneeEnCours]);

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

  const items = donneesEffectifs.data ?? [];
  const indicateurEffectif = useMemo(() => {
    if (!items.length) return null;

    const dataEffectifs: EffectifsData = buildTotalsFromCategories(items);
    const mois = dataEffectifs.dataMoisAnnee ?? [];
    const totaux = dataEffectifs.dataEtab ?? [];
    if (!mois.length || !totaux.length) return null;

    // dernier point valide
    let last = totaux.length - 1;
    while (last >= 0 && (totaux[last] === null || Number.isNaN(totaux[last] as any))) last--;
    if (last < 0) return null;

    const courant = Number(totaux[last]) || 0;
    const ref = mois[last];

    // iso-période (même mois année-1)
    const isoIdx = mois.findIndex((m) => m.mois === ref.mois && m.annee === ref.annee - 1);
    if (isoIdx < 0) return null;

    const precedent = Number(totaux[isoIdx]) || 0;
    const comparaisonLabel = `à ${MOIS[ref.mois - 1]} ${ref.annee - 1}`;
    const variation = precedent - courant;
    const deltaPct = precedent && precedent !== 0 ? (variation / precedent) * 100 : null;
    let variationText = '';

    if (deltaPct) {
      const rate = StringFormater.transformInRoundedRate(deltaPct);
      variationText = variation > 0
        ? `+${rate}% (+${variation})`
        : `${rate}% (${variation})`;
    }

    return { items, dataEffectifs, courant, precedent, variation, comparaisonLabel, variationText };
  }, [donneesEffectifs]);

  if (blocVigieRHViewModel.lesDonneesVigieRHNeSontPasRenseignees) {
    return <div>{wording.INDICATEURS_VIDES}</div>;
  }

  // Construit les items du treemap à partir des données d’effectifs par filière
  // Règles :
  // - on prend la DERNIÈRE valeur non nulle/non-NaN de la série (dernier mois disponible)
  // - on met la filière en "Label" avec majuscule initiale
  // - la "value" est forcée ≥ 0 (sécurise contre valeurs négatives inattendues)
  const itemsTreemap: TreemapItem[] = (blocVigieRHViewModel.lesDonneesEffectifs.data ?? []).map((c: any) => {
    // Série temporelle des effectifs pour la filière courante
    const serie: number[] = c?.dataCategorie?.dataFiliere ?? [];

    // Recherche depuis la fin le dernier point valide (≠ null et convertible en nombre)
    let i = serie.length - 1;
    while (i >= 0 && (serie[i] === null || Number.isNaN(Number(serie[i])))) i--;

    // Dernier effectif valide (ou 0 si aucun trouvé)
    const last = i >= 0 ? Number(serie[i]) : 0;

    // Libellé : première lettre en majuscule (ex. "soins" → "Soins")
    const label = c.categorie.charAt(0).toUpperCase() + c.categorie.slice(1);

    // On s’assure que la valeur est positive (évite d’écraser le treemap avec une valeur négative)
    return { label, value: Math.max(0, last) };
  });

  return (
    <>
      <ListeIndicateursNonAutorisesOuNonRenseignes blocVigieRHViewModel={blocVigieRHViewModel} />
      <div className="fr-grid-row fr-grid-row--gutters">
        {!blocVigieRHViewModel.lesEffectifsNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesEffectifsNeSontIlsPasAutorisee && indicateurEffectif ? (
          <div className="fr-col-4">
            <CarteTopIndicateur
              comparaisonLabel={indicateurEffectif.comparaisonLabel}
              currentValue={indicateurEffectif.courant}
              variation={indicateurEffectif.variation}
              variationText={indicateurEffectif.variationText}
            />
          </div>
        ) : (
          <></>
        )}
        {!blocVigieRHViewModel.lesDepartsEmbauchesNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesDepartsEmbauchesNeSontIlsPasAutorisee ? (
          <div className="fr-col-4">
            <CarteTopIndicateur
              comparaisonLabel={blocVigieRHViewModel.topIndicateurTauxRotation.comparaisonLabel}
              currentValue={blocVigieRHViewModel.topIndicateurTauxRotation.courant}
              periode={blocVigieRHViewModel.topIndicateurTauxRotation.dernierePeriode}
              title={wording.TOP_TAUX_ROTATION_TITLE}
              unitLabel={wording.TAUX_ROTATION}
              variation={blocVigieRHViewModel.topIndicateurTauxRotation.variation}
              variationText={blocVigieRHViewModel.topIndicateurTauxRotation.variationText}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
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
        )}
        {!blocVigieRHViewModel.lesEffectifsNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesEffectifsNeSontIlsPasAutorisee ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuEffectifs dateDeMiseÀJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs} source={wording.VIGIE_RH} />}
            identifiant="vr-effectifs"
            nomDeLIndicateur={wording.EFFECTIFS}
            source={wording.VIGIE_RH}
          >
            {(() => {
              const items = indicateurEffectif?.items ?? [];
              const EMPTY_EFFECTIFS: EffectifsData = { dataFiliere: [], dataEtab: [], dataMoisAnnee: [] };
              const dataEffectifsForChart = indicateurEffectif?.dataEffectifs ?? EMPTY_EFFECTIFS;

              return (
                <>
                  {/* Colonne graphique */}
                  <LineChart
                    classContainer="fr-mb-4w"
                    couleurEffectifsTotaux={couleurEffectifsTotaux}
                    couleursFilieres={couleursFilieres}
                    dataEffectifs={dataEffectifsForChart}
                    identifiantLegende="légende-graphique-effectifs"
                    multiCategories={items}
                  />
                </>
              );
            })()}
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {!blocVigieRHViewModel.lesEffectifsNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesEffectifsNeSontIlsPasAutorisee && indicateurEffectif ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuRepartitionEffectif />}
            identifiant="vr-repartition-effectif"
            nomDeLIndicateur={wording.REPARTITION_EFFECTIFS}
            source={wording.VIGIE_RH}
          >
            <GraphiqueTreemapRepartitionEffectif couleursFilieres={couleursFilieres} height={350} items={itemsTreemap.slice(0, 4)} />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {!blocVigieRHViewModel.lesRotationsNeSontIlsPasRenseignees && !blocVigieRHViewModel.lesRotationsNeSontIlsPasAutorisee ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-taux-rotation"
            nomDeLIndicateur={wording.TAUX_ROTATION}
            source={wording.VIGIE_RH}
          >
            <GraphiqueTauxRotation
              blocVigieRHViewModel={blocVigieRHViewModel}
              donneesTauxRotation={blocVigieRHViewModel.donneesTauxRotation}
              donneesTauxRotationTrimestriels={blocVigieRHViewModel.donneesTauxRotationTrimestrielles}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {!blocVigieRHViewModel.lesDureesCDDNeSontEllesPasRenseignees && !blocVigieRHViewModel.lesDureesCDDNeSontEllesPasAutorisee ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-duree-cdd"
            nomDeLIndicateur={wording.DUREE_CDD}
            source={wording.VIGIE_RH}
          >
            <GraphiqueDureeCDD
              blocVigieRHViewModel={blocVigieRHViewModel}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
      </ul>
    </>
  );
};

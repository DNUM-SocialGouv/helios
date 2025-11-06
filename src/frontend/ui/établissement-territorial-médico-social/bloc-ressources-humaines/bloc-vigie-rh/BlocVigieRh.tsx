import { useEffect, useMemo, useState } from "react";
import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import CarteTopIndicateur from "./CarteTopIndicateur";
import GraphiqueDepartEmbauches from "./Depart-embauche/GraphiqueDepartsEmbauches";
import GraphiqueDureeCDD from "./GraphiqueDureeCDD";
import LineChart, { EffectifsData } from "./GraphiqueLine";
import GraphiqueMotifsRuptureContrats from "./GraphiqueMotifsRuptureContrats";
import PyramidChart from "./GraphiquePyramide";
import GraphiqueTreemapRepartitionEffectif, { TreemapItem } from "./GraphiqueTreemapRepartitionEffectif";
import GraphiqueNatureContrats from "./NatureContrats";
import GraphiqueTauxRotation from "./Taux-rotation/GraphiqueTauxRotation";
import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { HistogrammeMensuelFilters } from "../../../commun/Graphique/HistogrammeMensuelFilters";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../../commun/NoDataCallout/NoDataCallout";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css";
import DepartsPrematuresCdi from "./departs-prematures-cdi/DepartsPrematuresCdi";
import { MOIS } from "../../../../utils/constantes";
import { NotAUthorized } from "../../../commun/notAuthorized/Notauthorized";
import { StringFormater } from "../../../commun/StringFormater";
import { ContenuEffectifs } from "../../InfoBulle/ContenuEffectifs";
import { ContenuPyramideDesAges } from "../../InfoBulle/ContenuPyramideDesAges";
import { ContenuRepartitionEffectif } from "../../InfoBulle/ContenuRepartitionEffectif";

type BlocVigieRHProps = Readonly<{
  etabFiness: string;
  etabTitle: string;
  blocVigieRHViewModel: BlocVigieRHViewModel;
}>;

const ListeIndicateursNonAutorisesOuNonRenseignes = ({ blocVigieRHViewModel }: BlocVigieRHProps) => {
  if (blocVigieRHViewModel.lesDonneesVgRHPasAutorises.length !== 0) {
    return <NotAUthorized indicateurs={blocVigieRHViewModel.lesDonneesVgRHPasAutorises} />;
  } else if (blocVigieRHViewModel.lesDonneesVgRHPasRenseignees.length > 0) {
    return <NoDataCallout indicateurs={blocVigieRHViewModel.lesDonneesVgRHPasRenseignees} />;
  } else {
    return <></>;
  }
};

type MonthYear = { mois: number; annee: number };

const buildTotalsFromCategories = (categories: ProfessionFiliereData[]): EffectifsData => {
  const sumByKey = new Map<string, number>();
  const monthByKey = new Map<string, MonthYear>();

  const registerValue = (annee: number, mois: number, valeur: number) => {
    if (!annee || !mois) return;
    const key = `${annee}-${String(mois).padStart(2, "0")}`;
    monthByKey.set(key, { annee, mois });
    sumByKey.set(key, (sumByKey.get(key) ?? 0) + valeur);
  };

  const collectFromArray = (serie: any[]) => {
    for (const row of serie) {
      const annee = Number(row?.annee);
      const mois = Number(row?.mois);
      const valeur = Number(row?.effectifFiliere ?? row?.effectif ?? 0);
      registerValue(annee, mois, valeur);
    }
  };

  const collectFromSerie = (serie: any) => {
    const moisAnnees = serie?.dataMoisAnnee ?? [];
    const valeurs = serie?.dataFiliere ?? [];
    const n = Math.min(moisAnnees.length, valeurs.length);
    for (let i = 0; i < n; i++) {
      const moisAnnee = moisAnnees[i];
      registerValue(Number(moisAnnee?.annee), Number(moisAnnee?.mois), Number(valeurs[i]) || 0);
    }
  };

  for (const cat of categories) {
    const dc: any = (cat as any)?.dataCategorie;
    if (!dc) continue;

    if (Array.isArray(dc)) {
      collectFromArray(dc);
      continue;
    }

    collectFromSerie(dc);
  }

  const ordered = Array.from(monthByKey.keys()).sort((a, b) => {
    const [ay, am] = a.split("-").map(Number);
    const [by, bm] = b.split("-").map(Number);
    return ay === by ? am - bm : ay - by;
  });
  const dataMoisAnnee: MonthYear[] = [];
  const dataEtab: number[] = [];
  for (const k of ordered) {
    dataMoisAnnee.push(monthByKey.get(k)!);
    dataEtab.push(sumByKey.get(k) ?? 0);
  }
  return { dataFiliere: [], dataEtab, dataMoisAnnee };
};

const useEffectifsGroupes = (blocVigieRHViewModel: BlocVigieRHViewModel) => {
  const filieresAvecGroupes = useMemo(() => blocVigieRHViewModel.filieresAvecGroupes, [blocVigieRHViewModel]);
  const [filiereSelectionnee, setFiliereSelectionnee] = useState<string>("");

  useEffect(() => {
    if (!filieresAvecGroupes.length) {
      setFiliereSelectionnee("");
      return;
    }
    if (!filiereSelectionnee || !filieresAvecGroupes.some((f: any) => f.categorie === filiereSelectionnee)) {
      setFiliereSelectionnee(filieresAvecGroupes[0].categorie);
    }
  }, [filieresAvecGroupes, filiereSelectionnee]);

  const filiereCourante = useMemo(
    () => filieresAvecGroupes.find((f: any) => f.categorie === filiereSelectionnee),
    [filieresAvecGroupes, filiereSelectionnee],
  );

  const groupesCourants = useMemo(() => filiereCourante?.groupes?.data ?? [], [filiereCourante]);

  const detailDataEffectifs = useMemo<EffectifsData>(() => {
    if (!filiereCourante) return { dataEtab: [], dataFiliere: [], dataMoisAnnee: [] };
    const serie = (filiereCourante as any)?.dataCategorie ?? {};
    let dataMoisAnnee = serie?.dataMoisAnnee ?? [];
    let dataFiliere = serie?.dataFiliere ?? [];

    if ((!dataMoisAnnee?.length || !dataFiliere?.length) && groupesCourants.length > 0) {
      const premiereSerieGroupe = (groupesCourants[0] as any)?.dataCategorie ?? {};
      dataMoisAnnee = premiereSerieGroupe?.dataMoisAnnee ?? [];
      dataFiliere = premiereSerieGroupe?.dataFiliere ?? [];
    }

    return {
      dataEtab: dataFiliere ?? [],
      dataFiliere: [],
      dataMoisAnnee: dataMoisAnnee ?? [],
    };
  }, [filiereCourante, groupesCourants]);

  const graphiqueEffectifsGroupesAffichable = blocVigieRHViewModel.graphiqueEffectifsGroupesAffichable && filieresAvecGroupes.length > 0;

  return {
    filieresAvecGroupes,
    filiereSelectionnee,
    setFiliereSelectionnee,
    groupesCourants,
    detailDataEffectifs,
    graphiqueEffectifsGroupesAffichable,
  };
};

export const BlocVigieRH = ({ etabFiness, etabTitle, blocVigieRHViewModel }: BlocVigieRHProps) => {
  const { wording } = useDependencies();
  const donneesPyramides = blocVigieRHViewModel.lesDonneesPyramideAges;
  const libelles = blocVigieRHViewModel.lesLibellesTranchesAges;
  const annees = donneesPyramides.map((donneeAnnuel) => donneeAnnuel.annee).sort((a, b) => a - b);
  const [anneeEnCours, setAnneeEnCours] = useState<number>(annees[annees.length - 1]);
  const [donneesAnneeEnCours, setDonneesAnneeEnCours] = useState<DonneesVigieRh>();

  const donneesEffectifs = blocVigieRHViewModel.lesDonneesEffectifs;
  const {
    filieresAvecGroupes,
    filiereSelectionnee,
    setFiliereSelectionnee,
    groupesCourants,
    detailDataEffectifs,
    graphiqueEffectifsGroupesAffichable,
  } = useEffectifsGroupes(blocVigieRHViewModel);

  const couleurEffectifsTotaux = "#ff6600ff"; // orange
  const couleursFilieres = ["#FF8E68","#E3D45C", "#D8A47E", "#E8C882"]; // réutilisées pour treemap + line
  const paletteGroupes = ["#FB926B", "#E2CF58", "#D69E75", "#E7CA8E", "#929359", "#D7D979", "#B9A597"];
  useEffect(() => {
    setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0]);
  }, [anneeEnCours]);
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
    const periodeLibelle = ref?.mois ? `jusque fin ${MOIS[ref.mois - 1]} ${ref.annee}` : '';

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

    return { items, dataEffectifs, courant, precedent, variation, comparaisonLabel, variationText, periodeLibelle };
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
      <ListeIndicateursNonAutorisesOuNonRenseignes blocVigieRHViewModel={blocVigieRHViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />
      <div className="fr-grid-row fr-grid-row--gutters">
        {blocVigieRHViewModel.graphiqueEffectifsAffichable && indicateurEffectif ? (
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
        {blocVigieRHViewModel.graphiqueDepartsEmbauchesAffichable ? (
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
        {blocVigieRHViewModel.graphiquePyramideAgesAffichable ? (
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
                    etabFiness={etabFiness}
                    etabTitle={etabTitle}
                    labels={libelles}
                  />
                )}
            </>
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueDepartsEmbauchesAffichable ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-departs-embauches"
            nomDeLIndicateur={wording.DEPARTS_EMBAUCHES}
            source={wording.VIGIE_RH}
          >
            <GraphiqueDepartEmbauches
              donneesDepartsEmbauches={blocVigieRHViewModel.lesDonneesDepartsEmbauches}
              donneesDepartsEmbauchesTrimestriels={blocVigieRHViewModel.donneesDepartsEmbauchesTrimestriels}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueEffectifsAffichable ? (
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
                    etabFiness={etabFiness}
                    etabTitle={etabTitle}
                    identifiantLegende="légende-graphique-effectifs"
                    identifiantTranscription="transcription-graphique-effectifs"
                    multiCategories={items}
                  />
                </>
              );
            })()}
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {graphiqueEffectifsGroupesAffichable ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuEffectifs dateDeMiseÀJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs} source={wording.VIGIE_RH} />}
            identifiant="vr-effectifs-groupes"
            nomDeLIndicateur={wording.EFFECTIFS_PAR_CATEGORIE_PROFESSIONNELLE}
            source={wording.VIGIE_RH}
          >
            <>
              <HistogrammeMensuelFilters
                ListeActivites={filieresAvecGroupes.map((f: any) => f.categorie)}
                activiteLabel={wording.SELECTIONNER_UNE_FILIERE}
                handleFrequency={() => undefined}
                identifiant="effectifs-groupes"
                selectedActivity={filiereSelectionnee}
                selectedFrequency={wording.MENSUEL}
                setSelectedActivity={setFiliereSelectionnee}
                showFrequencySwitch={false}
                showYearSelection={false}
                wording={wording}
              />
              <LineChart
                afficherSerieTotale={false}
                classContainer="fr-mb-4w"
                couleurEffectifsTotaux={couleurEffectifsTotaux}
                couleursFilieres={paletteGroupes}
                dataEffectifs={detailDataEffectifs}
                etabFiness={etabFiness}
                etabTitle={etabTitle}
                identifiantLegende="légende-graphique-effectifs-groupes" identifiantTranscription="transcription-graphique-effectifs-groupes" multiCategories={groupesCourants}              />
            </>
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueEffectifsAffichable && indicateurEffectif ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuRepartitionEffectif />}
            identifiant="vr-repartition-effectif"
            nomDeLIndicateur={wording.REPARTITION_EFFECTIFS}
            source={wording.VIGIE_RH}
          >
            <GraphiqueTreemapRepartitionEffectif
              couleursFilieres={couleursFilieres}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
              height={420}
              items={itemsTreemap.slice(0, 4)}
              periodeLibelle={indicateurEffectif.periodeLibelle}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueRotationsAffichable ? (
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
              etabFiness={etabFiness}
              etabTitle={etabTitle}
              nomGraph={wording.TAUX_ROTATION}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueMotifsAffichable ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-duree-cdd"
            nomDeLIndicateur={wording.DUREE_CDD}
            source={wording.VIGIE_RH}
          >
            <GraphiqueDureeCDD blocVigieRHViewModel={blocVigieRHViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nomGraph={wording.DUREE_CDD} />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueMotifsAffichable ? (
          <IndicateurGraphique
            contenuInfoBulle={<ContenuPyramideDesAges />}
            identifiant="vr-motif-rupture"
            nomDeLIndicateur={wording.MOTIFS_RUPTURE_CONTRAT}
            source={wording.VIGIE_RH}
          >
            <GraphiqueMotifsRuptureContrats blocVigieRHViewModel={blocVigieRHViewModel} etabFiness={etabFiness} etabTitle={etabTitle} nomGraph={wording.MOTIFS_RUPTURE_CONTRAT} />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueNatureContratsAffichable ? (
          <IndicateurGraphique
            contenuInfoBulle={<></>}
            identifiant="vr-nature-contrats"
            nomDeLIndicateur={wording.NATURE_CONTRATS}
            source={wording.VIGIE_RH}
          >
            <GraphiqueNatureContrats
              blocVigieRhViewModel={blocVigieRHViewModel}
              etabFiness={etabFiness}
              etabTitle={etabTitle}
              nomGraph={wording.NATURE_CONTRATS}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
        {blocVigieRHViewModel.graphiqueDepartsPrematuresCdiAffichable ? (
          <IndicateurGraphique
            contenuInfoBulle={<></>}
            identifiant="vr-departs-prematures-cdi"
            nomDeLIndicateur={wording.DEPARTS_PREMATURES_CDI}
            source={wording.VIGIE_RH}
          >
            <DepartsPrematuresCdi
              blocVigieRhViewModel={blocVigieRHViewModel}
            />
          </IndicateurGraphique>
        ) : (
          <></>
        )}
      </ul>
    </>
  );
};

import { CSSProperties, ReactElement, useEffect, useMemo, useState } from "react";
import "@gouvfr/dsfr/dist/component/select/select.min.css";

import { BlocVigieRHViewModel, DonneesVigieRh } from "./BlocVigieRHViewModel";
import CarteTopIndicateur from "./CarteTopIndicateur";
import GraphiqueDepartEmbauches from "./Depart-embauche/GraphiqueDepartsEmbauches";
import { DetailsParFiliere } from "./Details-par-filiere/DetailsParFiliere";
import GraphiqueDureeCDD from "./GraphiqueDureeCDD";
import LineChart, { EffectifsData } from "./GraphiqueLine";
import GraphiqueMotifsRuptureContrats from "./GraphiqueMotifsRuptureContrats";
import PyramidChart from "./GraphiquePyramide";
import GraphiqueTreemapRepartitionEffectif, { TreemapItem } from "./GraphiqueTreemapRepartitionEffectif";
import { ContenuDepartsEmbauchesVigieRh } from "./info-bulles/ContenuDepartsEmbauchesVigieRh";
import { ContenuDepartsPrematuresVigieRh } from "./info-bulles/ContenuDepartsPrematuresVigieRh";
import { ContenuDureeCddVigieRh } from "./info-bulles/ContenuDureeCddVigieRh";
import { ContenuEffectifsVigieRh } from "./info-bulles/ContenuEffectifsVigieRh";
import { ContenuMotifsRuptureVigieRh } from "./info-bulles/ContenuMotifsRuptureVigieRh";
import { ContenuNatureContratsVigieRh } from "./info-bulles/ContenuNatureContratsVigieRh";
import { ContenuPyramideAgesVigieRh } from "./info-bulles/ContenuPyramideAgesVigieRh";
import { ContenuRepartitionEffectifsVigieRh } from "./info-bulles/ContenuRepartitionEffectifsVigieRh";
import { ContenuTauxRotationVigieRh } from "./info-bulles/ContenuTauxRotationVigieRh";
import { ContenuTopContratsCourtsVigieRh } from "./info-bulles/ContenuTopContratsCourtsVigieRh";
import { ContenuTopEffectifVigieRh } from "./info-bulles/ContenuTopEffectifVigieRh";
import { ContenuTopTauxRotationVigieRh } from "./info-bulles/ContenuTopTauxRotationVigieRh";
import GraphiqueNatureContrats from "./NatureContrats";
import GraphiqueTauxRotation from "./Taux-rotation/GraphiqueTauxRotation";
import { ProfessionFiliereData } from "../../../../../backend/métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import { useDependencies } from "../../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../../commun/IndicateurGraphique/IndicateurGraphique";
import { NoDataCallout } from "../../../commun/NoDataCallout/NoDataCallout";
import styles from "../BlocRessourcesHumainesMédicoSocial.module.css";
import DepartsPrematuresCdi from "./departs-prematures-cdi/DepartsPrematuresCdi";
import { ABB_MOIS, MOIS } from "../../../../utils/constantes";
import { NotAUthorized } from "../../../commun/notAuthorized/Notauthorized";
import { StringFormater } from "../../../commun/StringFormater";

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

export const BlocVigieRH = ({ etabFiness, etabTitle, blocVigieRHViewModel }: BlocVigieRHProps) => {
  const { wording } = useDependencies();
  const donneesPyramides = blocVigieRHViewModel.lesDonneesPyramideAges;
  const libelles = blocVigieRHViewModel.lesLibellesTranchesAges;
  const annees = donneesPyramides.map((donneeAnnuel) => donneeAnnuel.annee).sort((a, b) => a - b);
  const [anneeEnCours, setAnneeEnCours] = useState<number>(annees[annees.length - 1]);
  const [donneesAnneeEnCours, setDonneesAnneeEnCours] = useState<DonneesVigieRh>();
  const [isExpanded, setIsExpanded] = useState(false);

  const showRefValues = process.env["NEXT_PUBLIC_SHOW_VIGIE_RH_REF"] === 'true';

  const donneesEffectifs = blocVigieRHViewModel.lesDonneesEffectifs;

  const couleurEffectifsTotaux = "#ff6600ff"; // orange
  const couleursFilieres = ["#FF8E68", "#E3D45C", "#D8A47E", "#E8C882"]; // réutilisées pour treemap + line
  const paletteGroupes = ["#FB926B", "#E2CF58", "#D69E75", "#E7CA8E", "#929359", "#D7D979", "#B9A597"];
  useEffect(() => {
    setDonneesAnneeEnCours(donneesPyramides.filter((donneeAnnuel) => donneeAnnuel.annee === anneeEnCours)[0]);
  }, [anneeEnCours]);
  const items = donneesEffectifs.data ?? [];
  const periodeIndicateursGlobal = blocVigieRHViewModel.echelleTemporelle.get("vr-indicateurs-global")?.valeur ?? "—";
  const recupereDateDonnees = (identifiant: string) => blocVigieRHViewModel.dateDonneesArrete(identifiant);
  const recuperePeriodeGlissante = (identifiant: string) => {
    const echelle = blocVigieRHViewModel.echelleTemporelle?.get(identifiant);
    return echelle?.valeurTranscription ?? echelle?.valeur ?? null;
  };

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
    const pastPeriod = `${MOIS[ref.mois - 1]} ${ref.annee - 1}`;
    const comparaisonLabel = `à ${ABB_MOIS[ref.mois - 1]} ${ref.annee - 1}`;
    const variation = precedent - courant;
    const deltaPct = precedent && precedent !== 0 ? (variation / precedent) * 100 : null;
    let variationText = '';

    if (deltaPct) {
      const rate = StringFormater.transformInRoundedRate(deltaPct);
      variationText = variation > 0
        ? `+${rate}%`
        : `${rate}%`;
    }

    return { items, dataEffectifs, courant, precedent, variation, comparaisonLabel, variationText, periodeLibelle, pastPeriod };
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

  const renderRow = (items: (ReactElement | null | false)[], columns: 2 | 3 = 3) => {
    const visibles = items.filter(Boolean) as ReactElement[];
    if (!visibles.length) return null;
    const colCount = Math.min(columns, visibles.length);
    const style = { ["--vigie-rh-cols" as const]: colCount } as CSSProperties;
    return (
      <ul
        className={`indicateurs ${styles["liste-indicateurs-vr"]}`}
        style={style}
      >
        {visibles}
      </ul>
    );
  };

  return (
    <>
      <ListeIndicateursNonAutorisesOuNonRenseignes blocVigieRHViewModel={blocVigieRHViewModel} etabFiness={etabFiness} etabTitle={etabTitle} />
      <section className={styles["vigie-rh-header"]}>
        <div className={styles["vigie-rh-title-block"]}>
          <h2 className="fr-h3 fr-mb-1v">Indicateurs clés</h2>
          <p className={styles["vigie-rh-caption"]}>
            <span>{wording.DONNEES_ARRETEES}</span>
            <span>{periodeIndicateursGlobal}</span>
            <span className={styles["vigie-rh-caption-separator"]}>-</span>
            <span>{wording.SOURCE}</span>
            <span>{wording.DECLARATION_SOCIALE_NOMINATIVE}</span>
          </p>
        </div>
        <div className={`fr-grid-row fr-grid-row--gutters ${styles["vigie-rh-top-indicateurs"]}`}>
          {blocVigieRHViewModel.graphiqueEffectifsAffichable && indicateurEffectif ? (
            <div className="fr-col-12 fr-col-md-4">
              <CarteTopIndicateur
                comparaisonLabel={indicateurEffectif.comparaisonLabel}
                contenuInfoBulle={
                  <ContenuTopEffectifVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-effectifs")}
                    source={wording.DSN}
                  />
                }
                currentValue={indicateurEffectif.courant}
                echelleTemporelle={blocVigieRHViewModel.echelleTemporelle.get("vr-effectifs")}
                etabFiness={etabFiness}
                etabTitle={etabTitle}
                identifiant="vr-top-effectifs"
                infoBulleTitle={wording.EFFECTIFS}
                pastPeriod={indicateurEffectif.pastPeriod}
                pastValue={indicateurEffectif.precedent}
                variation={indicateurEffectif.variation}
                variationText={indicateurEffectif.variationText}
              />
            </div>
          ) : (
            <></>
          )}
          {blocVigieRHViewModel.graphiqueDureeCddAffichable ? (
            <div className="fr-col-12 fr-col-md-4">
              <CarteTopIndicateur
                comparaisonLabel={blocVigieRHViewModel.topIndicateurContrats.comparaisonLabel}
                contenuInfoBulle={
                  <ContenuTopContratsCourtsVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-duree-cdd")}
                    periodeGlissante={recuperePeriodeGlissante("vr-duree-cdd")}
                    source={wording.DSN}

                  />
                }
                currentValue={blocVigieRHViewModel.topIndicateurContrats.courant}
                echelleTemporelle={blocVigieRHViewModel.echelleTemporelle.get("vr-duree-cdd")}
                etabFiness={etabFiness}
                etabTitle={etabTitle}
                identifiant="vr-top-duree-cdd"
                infoBulleTitle={wording.TOP_CONTRATS_TITLE}
                pastPeriod={blocVigieRHViewModel.topIndicateurContrats.pastPeriod}
                pastValue={blocVigieRHViewModel.topIndicateurContrats.precedent}
                title={wording.TOP_CONTRATS_TITLE}
                unitLabel={wording.TOP_CONTRATS_UNIT_LABEL}
                variation={blocVigieRHViewModel.topIndicateurContrats.variation}
                variationText={blocVigieRHViewModel.topIndicateurContrats.variationText}
              />
            </div>
          ) : (
            <></>
          )}
          {blocVigieRHViewModel.graphiqueDepartsEmbauchesAffichable ? (
            <div className="fr-col-12 fr-col-md-4">
              <CarteTopIndicateur
                comparaisonLabel={blocVigieRHViewModel.topIndicateurTauxRotation.comparaisonLabel}
                contenuInfoBulle={
                  <ContenuTopTauxRotationVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-taux-rotation")}
                    source={wording.DSN}
                  />
                }
                currentValue={blocVigieRHViewModel.topIndicateurTauxRotation.courant}
                echelleTemporelle={blocVigieRHViewModel.echelleTemporelle.get("vr-taux-rotation")}
                etabFiness={etabFiness}
                etabTitle={etabTitle}
                identifiant="vr-top-taux-rotation"
                infoBulleTitle={wording.TAUX_ROTATION}
                pastPeriod={blocVigieRHViewModel.topIndicateurTauxRotation.pastPeriod}
                pastValue={blocVigieRHViewModel.topIndicateurTauxRotation.precedent}
                title={wording.TOP_TAUX_ROTATION_TITLE}
                unitLabel={wording.TOP_TAUX_ROTATION_UNIT_TITLE}
                variation={blocVigieRHViewModel.topIndicateurTauxRotation.variation}
                variationText={blocVigieRHViewModel.topIndicateurTauxRotation.variationText}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </section>

      <div className={styles["liste-indicateurs-vr-wrapper"]}>
        <section aria-label="effectif" className={styles["vigie-rh-block-border"]}>
          <div className={styles["vigie-rh-title-block"]}>
            <h2 className="fr-h3 fr-mb-1v">Effectif</h2>
          </div>
          <div className={styles["liste-indicateurs-vr-wrapper"]}>
            {blocVigieRHViewModel.graphiqueEffectifsAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuEffectifsVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-effectifs")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-effectifs")}
                identifiant="vr-effectifs"
                key="vr-effectifs"
                nomDeLIndicateur={wording.EFFECTIFS}
                source={wording.DSN}
              >
                <LineChart
                  classContainer="fr-mb-4w"
                  couleurEffectifsTotaux={couleurEffectifsTotaux}
                  couleursFilieres={[]}
                  dataEffectifs={indicateurEffectif?.dataEffectifs ?? { dataFiliere: [], dataEtab: [], dataMoisAnnee: [] }}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                  identifiantLegende="légende-graphique-effectifs"
                  identifiantTranscription="transcription-graphique-effectifs"
                  multiCategories={[]}
                  nomGraph={wording.EFFECTIFS}
                />
              </IndicateurGraphique>
            ) : null}

            {renderRow([blocVigieRHViewModel.graphiquePyramideAgesAffichable ? (
              <IndicateurGraphique
                années={{ liste: annees, setAnnéeEnCours: setAnneeEnCours }}
                contenuInfoBulle={
                  <ContenuPyramideAgesVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-pyramide-ages")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-pyramide-ages")}
                identifiant="vr-pyramide-ages"
                key="vr-pyramide-ages"
                nomDeLIndicateur={wording.PYRAMIDE_DES_AGES}
                source={wording.DSN}
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
                        showRefValues={showRefValues}
                      />
                    )}
                </>
              </IndicateurGraphique>
            )
              : (
                <></>
              ), blocVigieRHViewModel.graphiqueEffectifsAffichable && indicateurEffectif ? (
                <IndicateurGraphique
                  contenuInfoBulle={
                    <ContenuRepartitionEffectifsVigieRh
                      dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                      dateDonneesArretees={recupereDateDonnees("vr-effectifs")}
                      source={wording.DSN}

                    />
                  }
                  echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-effectifs")}
                  identifiant="vr-repartition-effectif"
                  key="vr-repartition-effectif"
                  nomDeLIndicateur={wording.REPARTITION_EFFECTIFS}
                  source={wording.DSN}
                >
                  <GraphiqueTreemapRepartitionEffectif
                    couleursFilieres={couleursFilieres}
                    etabFiness={etabFiness}
                    etabTitle={etabTitle}
                    height={420}
                    items={itemsTreemap.slice(0, 4)}
                  />
                </IndicateurGraphique>
              ) : (
              <></>
            )
            ], 2)}
          </div>
          <section className="fr-accordion">
            <h3 className={styles["vigie-rh-accordion-button"]}>
              <button
                aria-controls="accordion-vigie-rh"
                aria-expanded={isExpanded}
                className="fr-btn fr-btn--secondary"
                onClick={() => setIsExpanded(true)}
                style={isExpanded ? { display: "none" } : {}}
              >
                {wording.SHOW_MORE_BUTTON}
              </button>
            </h3>
            <div
              className={`fr-collapse ${isExpanded ? "fr-collapse--expanded" : ""}`}
              id="accordion-vigie-rh"
            >
              <h3 className="fr-h3">{wording.EFFECTIFS_PAR_FILIERES_CATEGORIES}</h3>
              <DetailsParFiliere
                blocVigieRHViewModel={blocVigieRHViewModel}
                couleurEffectifsTotaux={couleurEffectifsTotaux}
                couleursFilieres={couleursFilieres}
                dataEffectifs={indicateurEffectif?.dataEffectifs ?? { dataFiliere: [], dataEtab: [], dataMoisAnnee: [] }}
                etabFiness={etabFiness}
                etabTitle={etabTitle}
                multiCategories={indicateurEffectif?.items ?? []}
                paletteGroupes={paletteGroupes}
              />
              <h3 className={styles["vigie-rh-accordion-button"]}>
                <button
                  className="fr-btn fr-btn--secondary"
                  onClick={() => setIsExpanded(false)}
                >
                  {wording.SHOW_LESS_BUTTON}
                </button>
              </h3>
            </div>
          </section>
        </section>
        <section aria-label="contrats-courts" className={styles["vigie-rh-block-border"]}>
          <div className={styles["vigie-rh-title-block"]}>
            <h2 className="fr-h3 fr-mb-1v">Contrats courts</h2>
          </div>
          {renderRow([
            blocVigieRHViewModel.graphiqueNatureContratsAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuNatureContratsVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-nature-contrats")}
                    source={wording.DSN}

                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-nature-contrats")}
                identifiant="vr-nature-contrats"
                key="vr-nature-contrats"
                nomDeLIndicateur={wording.NATURE_CONTRATS}
                source={wording.DSN}
              >
                <GraphiqueNatureContrats
                  blocVigieRhViewModel={blocVigieRHViewModel}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                  nomGraph={wording.NATURE_CONTRATS}
                  showRefValues={showRefValues}

                />
              </IndicateurGraphique>
            ) : null,
            blocVigieRHViewModel.graphiqueMotifsAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuDureeCddVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-duree-cdd")}
                    periodeGlissante={recuperePeriodeGlissante("vr-duree-cdd")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-duree-cdd")}
                identifiant="vr-duree-cdd"
                key="vr-duree-cdd"
                nomDeLIndicateur={wording.DUREE_CDD}
                source={wording.DSN}
              >
                <GraphiqueDureeCDD
                  blocVigieRHViewModel={blocVigieRHViewModel}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                  nomGraph={wording.DUREE_CDD}
                  showRefValues={showRefValues}
                />
              </IndicateurGraphique>
            ) : null
          ], 2)}
        </section>
        <section aria-label="mouvement" className={styles["vigie-rh-block-border"]}>
          <div className={styles["vigie-rh-title-block"]}>
            <h2 className="fr-h3 fr-mb-1v">Mouvement du personnel</h2>
          </div>
          {renderRow([
            blocVigieRHViewModel.graphiqueRotationsAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuTauxRotationVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-taux-rotation")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-taux-rotation")}
                identifiant="vr-taux-rotation"
                key="vr-taux-rotation"
                nomDeLIndicateur={wording.TAUX_ROTATION}
                source={wording.DSN}
              >
                <GraphiqueTauxRotation
                  blocVigieRHViewModel={blocVigieRHViewModel}
                  donneesTauxRotation={blocVigieRHViewModel.donneesTauxRotation}
                  donneesTauxRotationTrimestriels={blocVigieRHViewModel.donneesTauxRotationTrimestrielles}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                  nomGraph={wording.TAUX_ROTATION}
                  showRefValues={showRefValues}
                />
              </IndicateurGraphique>
            ) : null,
            blocVigieRHViewModel.graphiqueDepartsEmbauchesAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuDepartsEmbauchesVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-departs-embauches")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-departs-embauches")}
                identifiant="vr-departs-embauches"
                key="vr-departs-embauches"
                nomDeLIndicateur={wording.DEPARTS_EMBAUCHES}
                source={wording.DSN}
              >
                <GraphiqueDepartEmbauches
                  donneesDepartsEmbauches={blocVigieRHViewModel.lesDonneesDepartsEmbauches}
                  donneesDepartsEmbauchesTrimestriels={blocVigieRHViewModel.donneesDepartsEmbauchesTrimestriels}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                  showRefValues={showRefValues}
                />
              </IndicateurGraphique>
            ) : null,

            blocVigieRHViewModel.graphiqueDepartsPrematuresCdiAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuDepartsPrematuresVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-departs-prematures-cdi")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-departs-prematures-cdi")}
                identifiant="vr-departs-prematures-cdi"
                key="vr-departs-prematures-cdi"
                nomDeLIndicateur={wording.DEPARTS_PREMATURES_CDI}
                source={wording.DSN}
              >
                <DepartsPrematuresCdi
                  blocVigieRhViewModel={blocVigieRHViewModel}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                />
              </IndicateurGraphique>
            ) : null,
            blocVigieRHViewModel.graphiqueMotifsAffichable ? (
              <IndicateurGraphique
                contenuInfoBulle={
                  <ContenuMotifsRuptureVigieRh
                    dateDeMiseAJour={blocVigieRHViewModel.dateDeMiseAJourEffectifs}
                    dateDonneesArretees={recupereDateDonnees("vr-motif-rupture")}
                    periodeGlissante={recuperePeriodeGlissante("vr-motif-rupture")}
                    source={wording.DSN}
                  />
                }
                echelleTemporel={blocVigieRHViewModel.echelleTemporelle?.get("vr-motif-rupture")}
                identifiant="vr-motif-rupture"
                key="vr-motif-rupture"
                nomDeLIndicateur={wording.MOTIFS_RUPTURE_CONTRAT}
                source={wording.DSN}
              >
                <GraphiqueMotifsRuptureContrats
                  blocVigieRHViewModel={blocVigieRHViewModel}
                  etabFiness={etabFiness}
                  etabTitle={etabTitle}
                  nomGraph={wording.MOTIFS_RUPTURE_CONTRAT}
                  showRefValues={showRefValues}
                />
              </IndicateurGraphique>
            ) : null,
          ], 2)}
        </section>
      </div>
    </>
  );
};

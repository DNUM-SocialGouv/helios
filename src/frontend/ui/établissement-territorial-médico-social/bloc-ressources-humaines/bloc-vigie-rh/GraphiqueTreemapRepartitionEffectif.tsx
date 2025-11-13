"use client";

import { Chart as ChartJS, Tooltip, Legend } from "chart.js";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import React, { useMemo } from "react";
import { Chart } from "react-chartjs-2";

import { useDependencies } from "../../../commun/contexts/useDependencies";
import { StringFormater } from "../../../commun/StringFormater";
import { Transcription } from "../../../commun/Transcription/Transcription";

// Enregistrer treemap + plugins une seule fois (au chargement du module)
ChartJS.register(TreemapController, TreemapElement, Tooltip, Legend);

export type TreemapItem = Readonly<{ label: string; value: number }>;

type Props = Readonly<{
  etabFiness: string;
  etabTitle: string;
  items: TreemapItem[];
  height?: number;
  /** Optionnel : couleurs imposées par le parent (ordre des filières) */
  couleursFilieres?: string[];
  /** Libellé de la période affichée au-dessus du graphique */
  periodeLibelle?: string;
}>;

/* -------------------------------
 * Constantes & utilitaires
 * ----------------------------- */
const PALETTE = ["#E3D45C", "#D8A47E", "#FF8E68", "#E8C882"];
const FONT_FAMILY = "Marianne, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
const MIN_TILE_PERCENT_TO_DRAW_LABEL = 3; // < 3% : on n’écrit pas, on laisse le tooltip

/** Contraste texte/fond (YIQ) pour rester lisible sur toutes les couleurs. */
function pickTextColor(hex: string): string {
  const c = (hex || "").replace("#", "");
  if (c.length !== 6) return "#111";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#111" : "#fff";
}

/**
 * Coupe un texte en lignes selon la largeur réelle en pixels.
 * - Gère les mots très longs (aucun espace) en les “cassant” proprement si besoin.
 */
function wrapByWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = String(text ?? "")
    .trim()
    .split(/\s+/);
  const lines: string[] = [];
  let line = "";

  const pushOrSplit = (t: string) => {
    // Mot “trop long” (pas d’espace) : on le coupe en segments pour éviter qu’il dépasse
    if (ctx.measureText(t).width <= maxWidth) {
      lines.push(t);
      return;
    }
    let acc = "";
    for (const ch of t) {
      const test = acc + ch;
      if (ctx.measureText(test).width > maxWidth) {
        if (acc) lines.push(acc);
        acc = ch;
      } else {
        acc = test;
      }
    }
    if (acc) lines.push(acc);
  };

  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      // si le mot seul est trop large, on le segmente
      if (ctx.measureText(w).width > maxWidth) {
        pushOrSplit(w);
        line = "";
      } else {
        line = w;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* --------------------------------------------
 * Plugin custom : labels en haut-gauche + wrap
 * Rôle :
 *  - Dessine nous-mêmes les libellés dans chaque tuile du treemap
 *  - Position : coin haut-gauche
 *  - Adaptation : retour à la ligne en fonction de la largeur réelle de la tuile
 * Pourquoi un plugin (et pas labels intégrés) ?
 *  - Meilleur contrôle du rendu (police, wrapping, seuil d’affichage)
 *  - Évite les collisions et textos tronqués par défaut
 * Dépendances externes :
 *  - wrapByWidth(ctx, text, maxWidth): string[]  -> coupe le texte en lignes
 *  - pickTextColor(hex): string                  -> choisit noir/blanc selon contraste
 *  - Constantes : FONT_FAMILY, FORMAT_PCT_FR, MIN_TILE_PERCENT_TO_DRAW_LABEL
 *    (définies ailleurs pour rester DRY et cohérentes dans tout le projet)
 * ------------------------------------------ */
const treemapWrapLabelsPlugin = {
  id: "treemapWrapLabelsPlugin",

  /**
   * Hook Chart.js : appelé après le dessin des datasets.
   * On y prépare le contexte (fontes) puis on délègue le rendu tuile par tuile.
   * @param chart  instance Chart.js (contient ctx, meta, etc.)
   * @param _args  (non utilisé)
   * @param opts   options passées via options.plugins.treemapWrapLabelsPlugin
   *               -> { total, padding, fontSize, lineHeight, fontWeight }
   */
  afterDatasetsDraw(chart: any, _args: any, opts: any) {
    // Récupère le dataset treemap (index 0 par convention ici)
    const meta = chart.getDatasetMeta(0);
    const elements = meta?.data ?? [];

    // Total utilisé pour calculer les pourcentages (sécurisé à 0)
    const total = Number(opts?.total ?? 0) || 0;

    // Contexte 2D du canvas
    const ctx = chart.ctx as CanvasRenderingContext2D;

    // Paramètres de rendu avec valeurs par défaut
    const config = {
      padding: Number(opts?.padding ?? 6), // marge intérieure
      fontSize: Number(opts?.fontSize ?? 12),
      lineHeight: Number(opts?.lineHeight ?? 14),
      fontWeight: String(opts?.fontWeight ?? "500"),
    };

    // Prépare la police une seule fois
    ctx.save();
    ctx.font = `${config.fontWeight} ${config.fontSize}px ${FONT_FAMILY}`;

    // Dessine chaque tuile
    elements.forEach((el: any) => this.drawElement(ctx, el, total, config));

    // Restaure l’état du contexte
    ctx.restore();
  },

  /**
   * Dessine le libellé d’une tuile si celle-ci est suffisamment grande
   * et si les données sont valides.
   * @param ctx     CanvasRenderingContext2D
   * @param el      Élément treemap (Chart.js) avec positions/tailles
   * @param total   Somme de toutes les valeurs (pour le %)
   * @param config  padding/lineHeight/font…
   */
  drawElement(ctx: CanvasRenderingContext2D, el: any, total: number, config: any) {
    const { padding, lineHeight } = config;

    // Accès défensif aux propriétés (compat v3/v4 du contrôleur treemap)
    const raw = el?.$context?.raw;
    const x = el?.x ?? el?.x0 ?? 0;
    const y = el?.y ?? el?.y0 ?? 0;
    const w = el?.width ?? el?.w ?? 0;
    const h = el?.height ?? el?.h ?? 0;
    if (!w || !h) return; // tuile invisible/minuscule

    // Valeur (v) et nom (name) tels que fournis au dataset treemap
    const v = Number(raw?.v ?? 0);
    const name = String(raw?._data?.name ?? "");
    if (!name) return; // pas de libellé : rien à afficher

    // Pourcentage de la tuile dans le total, avec seuil minimal d’affichage
    const pct = total > 0 ? (v / total) * 100 : 0;
    if (pct < MIN_TILE_PERCENT_TO_DRAW_LABEL) return;

    // Exemple : "Médical (30,5%)"
    const label = `${StringFormater.round(pct, 0)}%`;

    // Couleur de texte : contraste auto par rapport au fond
    const bg = el?.options?.backgroundColor;
    ctx.fillStyle = typeof bg === "string" ? pickTextColor(bg) : "#111";

    // Largeur dispo pour dessiner (en gérant une marge interne)
    const maxTextWidth = Math.max(0, w - padding * 2);
    if (maxTextWidth <= 10) return; // trop étroit pour un rendu lisible

    // Découpage du libellé à la largeur de la tuile
    const lines = wrapByWidth(ctx, label, maxTextWidth);

    // Rendu ligne à ligne, du haut vers le bas
    this.drawLines(ctx, lines, { x, y, w, h, padding, lineHeight });
  },

  /**
   * Écrit les lignes calculées dans l’espace de la tuile,
   * en respectant les marges et sans dépasser la hauteur disponible.
   */
  drawLines(ctx: CanvasRenderingContext2D, lines: string[], dimensions: { x: number; y: number; w: number; h: number; padding: number; lineHeight: number }) {
    const { x, y, w, h, padding, lineHeight } = dimensions;

    // Position de la 1ʳᵉ ligne : un interligne sous le padding supérieur
    let ty = y + padding + lineHeight;
    const textX = x + w - padding;
    const previousAlign = ctx.textAlign;
    ctx.textAlign = "right";

    for (const line of lines) {
      // N’écrit plus si on dépasse le bas de la tuile
      if (ty > y + h - padding) break;

      // Texte aligné coin haut-gauche avec la marge
      ctx.fillText(line, textX, ty);
      ty += lineHeight;
    }
    ctx.textAlign = previousAlign;
  },
};

/* --------------------------------------------
 * Composant principal
 * ------------------------------------------ */
export default function GraphiqueTreemapRepartitionEffectif({ etabFiness, etabTitle, items, height = 420, couleursFilieres, periodeLibelle }: Props) {
  const { wording } = useDependencies();
  // Normalisation des données + choix des couleurs (parent > palette)
  const dataNorm = useMemo(
    () =>
      items.map((it, i) => ({
        label: it.label,
        value: Math.max(0, Number(it.value) || 0),
        color: couleursFilieres?.[i] ?? PALETTE[i % PALETTE.length],
        _idx: i, // index conservé pour colorer via callback
      })),
    [items, couleursFilieres],
  );

  const total = useMemo(() => dataNorm.reduce((s, d) => s + d.value, 0), [dataNorm]);

  const dataset = useMemo(
    () => ({
      type: "treemap" as const,
      // le contrôleur treemap attend un arbre d’objets : on y met name + v
      tree: dataNorm.map((d) => ({ name: d.label, v: d.value, _idx: d._idx })),
      key: "v", // valeur numérique prise en compte pour la surface
      spacing: 0,
      borderWidth: 1,
      borderColor: "#fff",
      // On récupère la couleur depuis l’index d’origine
      backgroundColor: (ctx: any) => {
        const idx = ctx?.raw?._data?._idx ?? ctx.dataIndex ?? 0;
        return dataNorm[idx]?.color ?? PALETTE[idx % PALETTE.length];
      },
      // On n’utilise pas les labels internes du plugin treemap :
      // le rendu est fait par notre plugin custom (wrap + positionnement)
      labels: { display: false },
    }),
    [dataNorm],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        // Tooltip entièrement contrôlé pour ne pas afficher la clé 'v' par défaut
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          displayColors: true,
          callbacks: {
            title: () => "", // pas de titre “v”
            label: (ti: any) => {
              const d = ti.raw?._data;
              const v = Number(ti.raw?.v ?? 0);
              const pct = total > 0 ? (v / total) * 100 : 0;
              return d?.name ? `${d.name} ` : `(${pct.toFixed(1)}%)`;
            },
          },
        },
        datalabels: { display: false } as any,
        // Paramètres passés à notre plugin (le total est requis pour le %)
        treemapWrapLabelsPlugin: {
          total,
          padding: 6,
          fontSize: 12,
          lineHeight: 14,
          fontWeight: "500",
        },
      },
      // Pas d’axes sur un treemap
      scales: {},
    }),
    [total],
  );

  const legendItems = useMemo(() => dataNorm.map(({ label, color }) => ({ label, color })), [dataNorm]);

  const transcriptionIdentifiants = useMemo(() => [wording.EFFECTIFS, wording.POURCENTAGE], [wording]);
  const transcriptionLibellés = useMemo(() => dataNorm.map(({ label }) => label), [dataNorm]);
  const transcriptionValeurs = useMemo(
    () => [
      dataNorm.map(({ value }) => value),
      dataNorm.map(({ value }) => {
        const pct = total > 0 ? (value / total) * 100 : 0;
        return `${StringFormater.round(pct, 0)}%`;
      }),
    ],
    [dataNorm, total],
  );

  return (
    <>
      <div style={{ height, display: "flex", flexDirection: "column" }}>
        {periodeLibelle ? (
          <p style={{ fontFamily: FONT_FAMILY, fontSize: "0.875rem", margin: "0 0 0.75rem" }}>
            <span style={{ fontWeight: 600 }}>Période représentée :</span> {periodeLibelle}
          </p>
        ) : null}
        <div style={{ flex: 1, minHeight: 0, maxWidth: height, margin: "0 auto", width: "100%" }}>
          <Chart data={{ datasets: [dataset as any] }} options={options as any} plugins={[treemapWrapLabelsPlugin]} style={{ height: "100%" }} type="treemap" />
        </div>
        {legendItems.length ? (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {legendItems.map((entry) => (
                <div key={entry.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: FONT_FAMILY, fontSize: "0.875rem" }}>
                  <span aria-hidden style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", backgroundColor: entry.color }} />
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <Transcription
        disabled={!transcriptionLibellés.length}
        entêteLibellé={wording.VIGIE_RH_CATEGORIE}
        etabFiness={etabFiness}
        etabTitle={etabTitle}
        identifiants={transcriptionIdentifiants}
        libellés={transcriptionLibellés}
        nomGraph={wording.REPARTITION_EFFECTIFS}
        valeurs={transcriptionValeurs}
      />
    </>
  );
}

import { ContenuAide, DefinitionSection, RessourceAide, SectionAide, SectionNormalisee } from "./types";

export const ICON_PAR_DEFAUT = "fr-icon-folder-open-line";

export const SECTIONS_STATIQUES: DefinitionSection[] = [
  {
    slug: "foire-aux-questions",
    titre: "Foire aux questions",
    icone: "fr-icon-question-answer-line",
    nature: "faq",
    ordre: 100,
  },
];

export const normaliserRoles = (valeurs?: (number | string)[]): number[] | undefined => {
  if (!valeurs) {
    return undefined;
  }

  const roles = valeurs
    .map((valeur) => (typeof valeur === "string" ? Number.parseInt(valeur, 10) : valeur))
    .filter((valeur): valeur is number => Number.isInteger(valeur));

  return roles.length > 0 ? roles : undefined;
};

export const formaterRoles = (valeurs?: (number | string)[]): string => {
  const roles = normaliserRoles(valeurs);
  return roles ? roles.join(", ") : "";
};

export const parserRoles = (valeur: string): number[] => {
  if (!valeur.trim()) {
    return [];
  }

  return valeur
    .split(/[,;\s]+/u)
    .map((element) => Number.parseInt(element, 10))
    .filter((element) => Number.isInteger(element));
};

export const trierRessources = (ressources: RessourceAide[] = []): RessourceAide[] =>
  ressources
    .slice()
    .sort((premiere, seconde) => (premiere.ordre ?? Number.MAX_SAFE_INTEGER) - (seconde.ordre ?? Number.MAX_SAFE_INTEGER));

export const reindexerRessources = (ressources: RessourceAide[]): RessourceAide[] =>
  ressources.map((ressource, index) => ({ ...ressource, ordre: index + 1 }));

const nettoyerSlug = (valeur: string) =>
  valeur
    .toLowerCase()
    .replace(/\s+/gu, "-")
    .replace(/[^a-z0-9-]/gu, "")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "");

export const creerSlug = (valeur: string, secours: string) => {
  const base = valeur.trim() || secours;
  const slug = nettoyerSlug(base);
  return slug || nettoyerSlug(secours) || undefined;
};

export const normaliserSection = (section?: SectionAide): SectionNormalisee => ({
  ...section,
  description: section?.description ?? "",
  resources: reindexerRessources(trierRessources(section?.resources ?? [])),
  order: typeof section?.order === "number" && Number.isFinite(section.order) ? section.order : undefined,
});

export const construireSectionsInitiales = (contenu: ContenuAide): ContenuAide => {
  const resultat: ContenuAide = {};

  for (const [slug, section] of Object.entries(contenu)) {
    resultat[slug] = normaliserSection(section);
  }

  for (const sectionStatique of SECTIONS_STATIQUES) {
    resultat[sectionStatique.slug] ??= normaliserSection({
        title: sectionStatique.titre,
        icon: sectionStatique.icone,
        kind: sectionStatique.nature,
        description: "",
        resources: [],
        order: sectionStatique.ordre,
      });
  }

  return resultat;
};

export const determinerDefinitionsSections = (contenu: ContenuAide): DefinitionSection[] => {
  const definitions: DefinitionSection[] = [];
  const repertoireStatique = SECTIONS_STATIQUES.reduce<Record<string, DefinitionSection>>((accumulateur, section) => {
    accumulateur[section.slug] = section;
    return accumulateur;
  }, {});

  let position = 0;

  for (const [slug, section] of Object.entries(contenu)) {
    const sectionStatique = repertoireStatique[slug];
    const ordre =
      typeof section?.order === "number" && Number.isFinite(section.order)
        ? section.order
        : sectionStatique?.ordre ?? position;

    definitions.push({
      slug,
      titre: section?.title?.trim() || sectionStatique?.titre || slug,
      icone: section?.icon?.trim() || sectionStatique?.icone || ICON_PAR_DEFAUT,
      nature: section?.kind === "faq" ? "faq" : sectionStatique?.nature ?? "resources",
      ordre,
    });

    position += 1;
  }

  for (const sectionStatique of SECTIONS_STATIQUES) {
    if (!contenu[sectionStatique.slug]) {
      definitions.push(sectionStatique);
    }
  }

  return definitions.sort((premiere, seconde) => {
    const ordrePremier = premiere.ordre ?? Number.MAX_SAFE_INTEGER;
    const ordreSecond = seconde.ordre ?? Number.MAX_SAFE_INTEGER;
    if (ordrePremier !== ordreSecond) {
      return ordrePremier - ordreSecond;
    }
    return premiere.titre.localeCompare(seconde.titre, "fr");
  });
};

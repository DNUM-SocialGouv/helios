import { ContenuAide, DefinitionSection, RessourceAide, SectionAide, SectionNormalisee } from "./types";

export const ROLES_SECTIONS = [
  { identifiant: 1, libelle: "Administrateur national" },
  { identifiant: 2, libelle: "Administrateur régional" },
  { identifiant: 3, libelle: "Administration centrale" },
  { identifiant: 4, libelle: "Utilisateur" },
] as const;

export const ICON_PAR_DEFAUT = "fr-icon-folder-2-line";

export const SECTIONS_STATIQUES: DefinitionSection[] = [
  {
    slug: "foire-aux-questions",
    titre: "Foire aux questions",
    icone: "fr-icon-question-answer-line",
    nature: "faq",
    ordre: 100,
  },
];

const ROLE_PAR_IDENTIFIANT = new Map<number, string>(
  ROLES_SECTIONS.map((role) => [role.identifiant, role.libelle])
);

export const libelleRole = (identifiant: number): string =>
  ROLE_PAR_IDENTIFIANT.get(identifiant) ?? `Rôle ${identifiant}`;

export const normaliserRoles = (valeurs?: (number | string)[]): number[] => {
  if (!valeurs) {
    return [];
  }

  const roles = Array.from(
    new Set(
      valeurs
        .map((valeur) => (typeof valeur === "string" ? Number.parseInt(valeur, 10) : valeur))
        .filter((valeur): valeur is number => Number.isInteger(valeur))
    )
  ).sort((premier, second) => premier - second);

  return roles;
};

export const formaterLibellesRoles = (valeurs?: (number | string)[]): string => {
  const roles = normaliserRoles(valeurs);
  if (roles.length === 0) {
    return "";
  }
  return roles.map(libelleRole).join(", ");
};

export const trierRessources = (ressources: RessourceAide[] = []): RessourceAide[] =>
  ressources
    .slice()
    .sort((premiere, seconde) => (premiere.ordre ?? Number.MAX_SAFE_INTEGER) - (seconde.ordre ?? Number.MAX_SAFE_INTEGER));

export const reindexerRessources = (ressources: RessourceAide[]): RessourceAide[] =>
  ressources.map((ressource, index) => {
    const {  ...autresChamps } = ressource;
    return { ...autresChamps, ordre: index + 1 };
  });
const nettoyerSlug = (valeur: string) =>
  valeur
    .toLowerCase()
    .replaceAll(/\s+/gu, "-")
    .replaceAll(/[^a-z0-9-]/gu, "")
    .replaceAll(/-+/gu, "-")
    .replace(/^-+/u, "")
    .replace(/-+$/u, "");

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
      type: sectionStatique.nature,
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
      titre: section?.title?.trim() ?? sectionStatique?.titre ?? slug,
      icone: section?.icon?.trim() ?? sectionStatique?.icone ?? ICON_PAR_DEFAUT,
      nature: section?.type === "faq" ? "faq" : sectionStatique?.nature ?? "resources",
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

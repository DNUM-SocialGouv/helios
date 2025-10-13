import internetSvg from "@gouvfr/dsfr/dist/artwork/pictograms/digital/internet.svg"
import documentSvg from "@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg"
import videoSvg from "@gouvfr/dsfr/dist/artwork/pictograms/leisure/video.svg"

import {
  determinerDefinitionsSections,
  normaliserSection,
  ICON_PAR_DEFAUT,
  SECTIONS_STATIQUES,
  trierRessources,
} from "../parametrage-aide/aideUtils";
import type {
  ContenuAide,
  DefinitionSection,
  RessourceAide,
  SectionNormalisee,
} from "../parametrage-aide/types";


export type IdentifiantRole = number | null;

const normaliserRoles = (valeurs?: (number | string)[]): number[] | undefined => {
  if (!valeurs) {
    return undefined;
  }

  const roles = valeurs
    .map((valeur) => (typeof valeur === "string" ? Number.parseInt(valeur, 10) : valeur))
    .filter((valeur): valeur is number => Number.isInteger(valeur));

  return roles.length > 0 ? roles : undefined;
};

export const estAutorisePourRole = (metadonnees: RessourceAide | SectionNormalisee | undefined, role: IdentifiantRole) => {
  if (!metadonnees) {
    return true;
  }

  const autorises = normaliserRoles((metadonnees as any).allowedRoles ?? (metadonnees as any).roles);
  if (autorises && autorises.length > 0) {
    return role !== null && autorises.includes(role);
  }

  const refuses = normaliserRoles((metadonnees as any).excludedRoles ?? (metadonnees as any).hiddenForRoles);
  if (refuses && refuses.length > 0) {
    return role === null || !refuses.includes(role);
  }

  return true;
};

export const resoudreSections = (contenu: ContenuAide): DefinitionSection[] => determinerDefinitionsSections(contenu);

export const sectionsVisibles = (contenu: ContenuAide, role: IdentifiantRole): DefinitionSection[] =>
  resoudreSections(contenu).filter((definition) => {
    const sectionNormalisee = normaliserSection(contenu[definition.slug]);
    return estAutorisePourRole(sectionNormalisee, role);
  });

export const obtenirSectionNormalisee = (contenu: ContenuAide, slug: string): SectionNormalisee | undefined =>
  slug ? normaliserSection(contenu[slug]) : undefined;

export const regrouperRessourcesParType = (ressources: RessourceAide[]) => trierRessources(ressources);

export const RESSOURCES_ICONES = [
  { type: "document" as const, titre: "Documents", icone: documentSvg },
  { type: "video" as const, titre: "Vidéos", icone: videoSvg },
  { type: "link" as const, titre: "Liens utiles", icone: internetSvg },
];

export const estSectionSupprimable = (slug: string): boolean => !SECTIONS_STATIQUES.some((section) => section.slug === slug);

export const iconeParDefaut = ICON_PAR_DEFAUT;

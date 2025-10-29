import internetSvg from "@gouvfr/dsfr/dist/artwork/pictograms/digital/internet.svg"
import documentSvg from "@gouvfr/dsfr/dist/artwork/pictograms/document/document.svg"
import videoSvg from "@gouvfr/dsfr/dist/artwork/pictograms/leisure/video.svg"

import {
  determinerDefinitionsSections,
  normaliserRoles,
  normaliserSection,
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

export const sectionVisiblePourRole = (section: SectionNormalisee | undefined, role: IdentifiantRole): boolean => {
  if (!section) {
    return false;
  }
  if(section.type === "faq") return true;
  const rolesAutorises = normaliserRoles(section.allowedRoles);
  if (rolesAutorises.length === 0) {
    return false;
  }
  return role !== null && rolesAutorises.includes(role);
};

export const resoudreSections = (contenu: ContenuAide): DefinitionSection[] => determinerDefinitionsSections(contenu);

export const sectionsVisibles = (contenu: ContenuAide, role: IdentifiantRole): DefinitionSection[] =>
  resoudreSections(contenu).filter((definition) => {
    const sectionNormalisee = normaliserSection(contenu[definition.slug]);
    return sectionVisiblePourRole(sectionNormalisee, role);
  });

export const obtenirSectionNormalisee = (contenu: ContenuAide, slug: string): SectionNormalisee | undefined =>
  slug ? normaliserSection(contenu[slug]) : undefined;

export const regrouperRessourcesParType = (ressources: RessourceAide[]) => trierRessources(ressources);

export const RESSOURCES_ICONES = [
  { type: "document" as const, titre: "Documents", icone: documentSvg },
  { type: "video" as const, titre: "Vidéos", icone: videoSvg },
  { type: "lien" as const, titre: "Liens utiles", icone: internetSvg },
];

export const estSectionSupprimable = (slug: string): boolean => !SECTIONS_STATIQUES.some((section) => section.slug === slug);

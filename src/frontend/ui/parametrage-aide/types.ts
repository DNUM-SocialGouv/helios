export type IdentifiantSection = string;

export type MetadonneesRoles = Readonly<{
  allowedRoles?: (number | string)[];
  roles?: (number | string)[];
  excludedRoles?: (number | string)[];
  hiddenForRoles?: (number | string)[];
}>;

export type RessourceAide = Readonly<
  MetadonneesRoles & {
    slug?: string;
    nom: string;
    type: "document" | "video" | "link";
    contenu: string;
    ordre?: number;
    date?: string;
    nom_telechargement?: string;
  }
>;

export type SectionAide = Readonly<
  MetadonneesRoles & {
    title?: string;
    icon?: string;
    kind?: "resources" | "faq";
    description?: string;
    resources?: RessourceAide[];
    order?: number;
  }
>;

export type ContenuAide = Partial<Record<IdentifiantSection, SectionAide>>;

export type SectionNormalisee = SectionAide & {
  description: string;
  resources: RessourceAide[];
  order?: number;
};

export type DefinitionSection = Readonly<{
  slug: IdentifiantSection;
  titre: string;
  icone: string;
  nature: "resources" | "faq";
  ordre?: number;
}>;

export type SectionEditable = DefinitionSection & {
  peutEtreSupprimee: boolean;
};

// Compatibilité avec l’existant
export type AideContent = ContenuAide;

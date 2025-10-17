export type MetadonneesRoles = Readonly<{
  allowedRoles?: (number | string)[];
  roles?: (number | string)[];
}>;

export type RessourceUtilisateur = Readonly<{
  id?: string;
  prenom?: string;
  nom?: string;
}>;

export type RessourceAide = Readonly<
  MetadonneesRoles & {
    slug?: string;
    nom: string;
    type: "document" | "video" | "lien";
    lien: string;
    ordre?: number;
    date?: string;
    nom_telechargement?: string;
    updatedBy?: RessourceUtilisateur;
  }
>;

export type SectionAide = Readonly<
  MetadonneesRoles & {
    title?: string;
    icon?: string;
    type?: "resources" | "faq";
    description?: string;
    resources?: RessourceAide[];
    order?: number;
  }
>;

export type ContenuAide = Partial<Record<string, SectionAide>>;

export type SectionNormalisee = SectionAide & {
  description: string;
  resources: RessourceAide[];
  order?: number;
};

export type DefinitionSection = Readonly<{
  slug: string;
  titre: string;
  icone: string;
  nature: "resources" | "faq";
  ordre?: number;
}>;

export type SectionEditable = DefinitionSection & {
  peutEtreSupprimee: boolean;
};

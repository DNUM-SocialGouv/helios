// Comparaison
export const COMPARAISON_LANCER_RECHERCHE_AVANCEE = { category: 'comparaison', action: 'lancer', name: 'recherche avancee' };
export const COMPARAISON_LANCER_LISTE = { category: 'comparaison', action: 'lancer', name: 'liste' };
export const COMPARAISON_LANCER_FICHE_ETABLISSEMENT = { category: 'comparaison', action: 'lancer', name: 'fiche etablissement' };

// Export
export const EXPORT = (source: string) => {
  return { category: 'export', action: 'lancer', name: source };
}

// Navigation
export const CONSOLE_ADMIN = {category: 'navigation', action: 'console_admin'};
export const CARTOGRAPHIE = {category: 'navigation', action: 'cartographie'};
export const HISTORIQUE = {category: 'navigation', action: 'historique'};
export const AIDE = {category: 'navigation', action: 'aide'};

// Recherche 
export const RECHERCHE_SIMPLE = {category: 'recherche', action: 'simple'};

// Connexion
export const CONNEXION = {category: 'session', action: 'connexion'};

/** Recheche avancée */
export const RECHERCHE_REINITIALISER = {category: 'recherche', action: 'reinitialiser'};
export const RECHERCHE_AVANCEE = {category: 'recherche', action: 'avancee'};
export const RECHERCHE_AVANCEE_FILTRE_GEO = {category: 'filtre', action: 'appliquer', name: 'zone geo'};
export const RECHERCHE_AVANCEE_FILTRE_STRUCTURE = {category: 'filtre', action: 'appliquer', name: 'type structure'};
export const RECHERCHE_AVANCEE_FILTRE_CATEGORIES = {category: 'filtre', action: 'appliquer', name: 'categorie finess'};
export const RECHERCHE_AVANCEE_FILTRE_CAPACITE = {category: 'filtre', action: 'appliquer', name: 'capacites'};
export const RECHERCHE_AVANCEE_FILTRE_ACTIVITE = {category: 'filtre', action: 'appliquer', name: 'activites'};
/** Filtre structure */
export const FILTRE_STRUCTURE_EJ = {category: 'filtre', action: 'valeur_type_structure', name: 'ej'};
export const FILTRE_STRUCTURE_SAN = {category: 'filtre', action: 'valeur_type_structure', name: 'sanitaire'};
export const FILTRE_STRUCTURE_MS = {category: 'filtre', action: 'valeur_type_structure', name: 'medico_social'};
/** Statut juridique */ 
export const FILTRE_STATUT_JURIDIQUE_PUBLIC = {category: 'filtre', action: 'valeur_statut_juridique', name: 'public'};
export const FILTRE_STATUT_JURIDIQUE_PL= {category: 'filtre', action: 'valeur_statut_juridique', name: 'prive_lucratif'};
export const FILTRE_STATUT_JURIDIQUE_PNL = {category: 'filtre', action: 'valeur_statut_juridique', name: 'prive_non_lucratif'};

// création de liste
export const CREATION_LISTE = {category: 'liste', action: 'creer'};

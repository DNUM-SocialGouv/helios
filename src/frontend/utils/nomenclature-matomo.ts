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
export const AIDE = {category: 'navigation', action: 'aide'};

// Recherche 
export const RECHERCHE_SIMPLE = {category: 'recherche', action: 'simple'};

// création de liste
export const CREATION_LISTE = {category: 'liste', action: 'creer'};
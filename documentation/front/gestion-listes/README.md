# Gestion des listes

Les listes permettent de sauvegarder des sélections d'établissements pour un usage ultérieur, le partage avec des collègues, ou la préparation de comités et analyses.

## Fonctionnalités

- **[Création d'une liste](creation-liste.md)** : créer une nouvelle liste d'établissements
- **[Ajout d'un établissement](ajout-etablissement.md)** : ajouter un établissement à une liste existante
- **[Ajout de plusieurs établissements](ajout-plusieurs-etablissements.md)** : ajout groupé d'établissements
- **[Suppression d'un établissement](suppression-etablissement.md)** : retirer un établissement d'une liste
- **[Suppression de plusieurs établissements](suppression-plusieurs-etablissements.md)** : suppression groupée
- **[Gestion d'une liste](gestion-liste.md)** : modifier le titre, supprimer une liste, actions disponibles
- **[Import d'établissements](import-etablissements.md)** : importer une liste depuis un fichier FINESS

## Workflow de gestion des listes

```mermaid
flowchart TD
    A[Point d'entrée] --> B{Type d'opération}
    B -->|Création| C[Créer nouvelle liste]
    B -->|Ajout| D[Ajouter établissements]
    B -->|Modification| E[Modifier liste]
    B -->|Suppression| F[Supprimer établissements]
    B -->|Import| G[Importer depuis fichier]
    
    C --> H{Saisie nom liste}
    H --> I{Vérification unicité}
    I -->|Nom existe| J[Message erreur]
    J --> H
    I -->|Nom unique| K[Création dans user_list]
    
    D --> L{Sélection établissements}
    L --> M[Ajout dans user_list_etablissement]
    
    E --> N{Modification}
    N -->|Titre| O[Mise à jour nom]
    N -->|Partage| P{Vérification rôle}
    P -->|ADMIN_NAT/ADMIN_REG| Q[Partage autorisé]
    P -->|Autre| R[Partage refusé]
    
    F --> S[Suppression de user_list_etablissement]
    
    G --> T[Validation format fichier]
    T --> U[Vérification FINESS]
    U --> V[Import établissements valides]
    
    K --> W[Liste créée]
    M --> W
    O --> W
    Q --> W
    S --> W
    V --> W
```

## Traçabilité

Chaque liste conserve :
- Le nom de l'auteur
- La date de création
- Les numéros FINESS des établissements inclus
- La date de dernière modification

## Partage

{% hint style="info" %}
Seuls les rôles habilités (ADMIN_NAT, ADMIN_REG) peuvent partager une liste à l'échelle régionale ou nationale. Les utilisateurs USER peuvent uniquement créer et gérer leurs propres listes privées.
{% endhint %}

# Vigie RH

## Présentation

Vigie RH est un bloc spécifique présent sur les fiches d'établissements médico-sociaux, et plus particulièrement pour les **EHPAD** (Établissements d'Hébergement pour Personnes Âgées Dépendantes).

## Spécificité EHPAD

{% hint style="info" %}
**Disponibilité Vigie RH** : Le bloc Vigie RH est disponible uniquement pour les établissements de type EHPAD (Établissements d'Hébergement pour Personnes Âgées Dépendantes). Les données proviennent des déclarations DSN (Déclaration Sociale Nominative).
{% endhint %}

[Capture écran : bloc Vigie RH sur une fiche EHPAD]

Le bloc Vigie RH affiche des indicateurs de ressources humaines issus des **données DSN** (Déclaration Sociale Nominative). Ces données sont disponibles uniquement pour les établissements de type EHPAD.

## Liste des indicateurs Vigie RH

### Contrats

- **Nature des contrats** (annuel et trimestriel) :
  - CDI (Contrat à Durée Indéterminée)
  - CDD (Contrat à Durée Déterminée)
  - Effectifs par type de contrat
  - Effectifs de référence

### Durées CDD

- **Répartition des durées de CDD** :
  - Effectifs par tranche de durée
  - Effectifs de référence

### Mouvements

- **Mouvements annuels** :
  - Nouveaux contrats
  - Fins de contrats
  - Taux de rotation
  - Départs prématurés en CDI
  - Valeurs de référence

- **Mouvements trimestriels** :
  - Nouveaux contrats par trimestre
  - Fins de contrats par trimestre
  - Taux de rotation trimestriel

### Pyramide des âges

- **Répartition par tranches d'âge** :
  - Effectifs hommes et femmes par tranche d'âge
  - Effectifs de référence

### Motifs de rupture de contrats

- **Répartition des motifs de rupture** :
  - Effectifs par motif de rupture
  - Effectifs de référence

### Effectifs par profession et filière

- **Effectifs par groupe de profession**
- **Effectifs par filière professionnelle**

## Source des données

Source : **Vigie RH** (données DSN)

Les données sont récupérées via SFTP et intégrées dans Helios selon un calendrier défini (voir partie BACK pour les détails techniques).

## Affichage

[Capture écran : graphiques Vigie RH]

Les indicateurs sont présentés sous forme de graphiques et tableaux avec :
- Les valeurs observées
- Les valeurs de référence (si disponibles)
- Les dates de mise à jour
- Des messages si les données ne sont pas disponibles

## Cas limites

- Si l'établissement n'est pas un EHPAD : le bloc Vigie RH n'est pas affiché.
- Si les données DSN ne sont pas disponibles : un message indique l'absence de données.
- Si les données ne sont pas autorisées pour le profil utilisateur : un message d'information est affiché.

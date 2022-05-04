# ADR 1 : Les langues dans le code

* Status: accepté
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno
* Date: 09-05-2022

## Contexte
Normaliser la langue utilisée par les développeurs pour coder et documenter le projet.

## Décision

Nous utiliserons : 
- **Le français** pour le code métier, la documentation et l'intention des tests ;
- **L'anglais** pour le code technique.

## Éléments de décision
- Notre métier est en français, donc notre *ubiquitous language* est en français. Avoir le code dans cette langue diminue donc notre charge cognitive ;
- Le projet relève du service public, son fonctionnement doit donc être compréhensible par des personnes parlant le français et pas forcément l'anglais ;
- Le jargon technique du développement logiciel est majoritairement en anglais. Il est beaucoup plus simple de trouver de l'aide en cherchant les termes techniques en anglais qu'en français. Utiliser l'anglais pour la technique permet donc de réduire notre charge cognitive ;
- L'anglais est plus concis et permet d'avoir des lignes de code plus courtes donc plus lisibles.

## Conséquences

Notre code sera bilingue : 
- les parties associées au métier seront en français ;
- les parties associées à la technique seront en anglais ;
- sa documentation et la description des cas de test seront en français.

À noter que les noms des fichiers dans *pages* ne comportent pas d'accent à cause de contraintes techniques de Next. Cependant, le reste des fichiers et le code en a.
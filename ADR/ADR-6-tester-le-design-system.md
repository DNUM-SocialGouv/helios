# ADR 6 : Comment tester les élements interactifs du Design System Français ?

* Status: accepté
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno
* Date: 2022-08-31

## Contexte

Il y a des comportements fonctionnels non testés aujourd'hui dans notre code.
Ceci est dû à ce que :

* La librairie qu'on utilise pour tester nos composants, react testing library, n'a pas connaissance du code JS qui s'assure des comportements dynamiques. Ceci est dû à l'utilisation du Design System Français
* Pour vérifier les comportements dynamiques, il nous faudrait donc simuler une navigation sur le site. Cela nécessiterait l'intégration d'une nouvelle librairie

On se demande si ça vaut la peine d'intégrer une librairie de ce type pour tester automatiquement les comportements dynamiques ou si on se repose sur des tests de non-régression manuels

## Décision

* Nous n'écrirons pas de test end2end
* Nous renforcerons la recette

## Éléments de décision

* Nous avons confiance dans ce que fait le Design System Français
* Il est couteux d'ajouter une nouvelle librairie de test end2end
* Les tests end2end sont moins rapides que les tests unitaires : ils rallongeraient la boucle de feedback de nos tests
* Le lancement du MVP est imminent donc ce n'est pas prioritaire. À ce jour, ne pas tester ces comportements n'est pas une douleur, on verra si besoin de l'implémenter plus tard

## Conséquences

Toute l'équipe doit être au courant de ce point et recetter ces éléments interactifs en conséquence :

* Transcription
* Info-bulle
* Accordéon des autorisations

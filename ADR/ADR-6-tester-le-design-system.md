# ADR 5 : Comment tester les élements interatifs du Design System Français ?

* Status: en cours
* Décideurs: Fabien Mercier, Thierry Gonard, Sofía Calcagno
* Date: 2022-08-31

## Contexte

Helios utilise le Design System Français pour avoir des composants visuels déjà tout fait.
Certains composants peuvent avoir des interactions avec l'utilisateur du genre accordéon, modale, ...
Le CSS est importé au plus près de notre code l'utilisant, par contre, le JS est importé au plus niveau, c'est-à-dire dans le fichier `_app.ts`.
Ces derniers fonctionnent très bien dans un navigateur mais sont inutilisable via notre framework de test "React Testing Library" sans rajouter une couche de React (très souvent, des states). De ce fait, ce genre de test ne garantie pas le bon fonctionnement du JS du Design System.

Il faudrait plutôt écrire des tests end2end pour simuler un navigateur pour interpréter le site en entier.

## Décision

Nous n'écrirons pas de test end2end.

## Éléments de décision

On part du principe que nous avons confiance dans ce que fait le Design System Français.

## Conséquences

Toute l'équipe doit être au courant de ce point et recetter ces éléments interactifs en conséquence.

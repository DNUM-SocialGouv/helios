# Peut-on revoir notre façon de faire le front pour ne plus utiliser de frameworks ?

L'investissement pour faire du front sans framework semble à ce stade assez conséquent.

## Hypothèse falsifiable

- Nous pensons qu'utiliser du templating plutôt qu'un framework pour notre front
- Nous permettra :
  - d'alléger les données envoyées à l'utilisateur dans une démarche d'éco-conception 
  - de réduire la maintenance des librairies 
  - tout en nous permettant de maintenir nos pratiques de développement
- ⌛ Avec un effort de migration d'**1/2 journée**

## Configuration de l'expérimentation
Afin de savoir si cette migration est envisageable, on se demande s'il est possible de :

- [ ✔ ] Intégrer le *design system* de l'État
- [ ✔ ] Créer un composant en utilisant du *templating* et le lier au *design system* 
  - [ ✔ ] le tester sémantiquement
  - [ ⨯ ] Tester les interactions client
  - [ ✔ ] Tester l'accessibilité
- [ ✔ ] Créer un *web component*, agnostique de n'importe quel *framework*
- [ ⨯ ] Identifier les outils de développement (linting CSS, webpack / vite)
- [ ✔ ] Creuser la possibilité de faire du hot reload
- [ ✔ ] Faire du refactoring en même temps sur les presenters et les templates ?
- [ ✔ ] Refactorer le front facilement pour passer sur du templating ou des *web components*

## Résultats

### Intégrer le *design system* de l'État
 
- On peut intégrer le design system en l'installant avec yarn puis en le copiant dans public. On y fait référence 
en pointant dans /public

### Créer un composant en utilisant du *templating* et le lier au *design system*

- Nous avons réussi à créer des composants utilisant du *templating*
- Nous avons réussi à faire des tests sémantiques
- On n'a pas testé les interactions client, mais nous avons une idée de comment le faire
- Pour les tests d'accessibilité, on a découvert l'outil de linting *access lint*

### Créer un *web component*, agnostique de n'importe quel *framework*

- On a créé un bouton avec un *toggle* : quand on cliquait dessus on supprimait ou affichait du texte
- On en a conclu que l'infobulle pourrait être codée en suivant cette logique
- On peut tenter de créer un *web component* tout en utilisant le framework *next* pour faciliter une éventuelle migration

### Identifier les outils de développement (linting CSS, webpack / vite)

- On n'aurait pas besoin d'outils de linting de CSS parce qu'on n'en ferait pas beaucoup
- On n'a pas répondu pour webpack

### Creuser la possibilité de faire du hot reload

- le back faisait du hot-reload
- le front n'était cependant pas rechargé lorsqu'il y avait une modification parce que *nest* n'observe pas les modifications du front
- on est obligés de rafraîchir le navigateur

### Refactoring

- On n'a pas trouvé de façon de refactorer en même temps les presenters (en ts) et les templates (en html). 
Mais comme on n'a que deux pages, l'effort ne devrait pas être très fort
- Si on veut migrer en *templating* / *web component* il faudrait migrer tout le back (back et front sont couplés dans notre implémentation)
- Si on veut faire des *web components*, il faudrait que l'équipe monte en formation

## Conclusion

- Notre application peut être implémentée en utilisant uniquement du *templating* ou des *web components*
- Cependant, l'effort de migration est un peu trop important avec nos *deadlines* actuelles

- [ ❌ ] INVALIDATED ❌

## Prochaines étapes

Nous reconsidérerons l'utilisation des *frameworks* à la fin de l'expérimentation et discuterons de l'opportunité de 
consacrer du temps à l'amélioration de l'éco-conception.
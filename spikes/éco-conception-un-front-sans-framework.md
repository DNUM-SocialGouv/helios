# Peut-on revoir notre façon de faire le front pour ne plus utiliser de frameworks ?

L'investissement pour faire du front sans framework semble à ce stade assez conséquent.

## Hypothèse falsifiable

- Nous pensons qu'utiliser du templating plutôt qu'un framework pour notre front
- Nous permettra d'alléger les données envoyées à l'utilisateur et réduire la maintenance des librairies tout en nous permettant de maintenir nos pratiques de développement
- ⌛ Avec un effort de migration d'**1/2 journée**

## Configuration de l'expérimentation
Afin de savoir si cette migration est envisageable, on se demande :

- [ ✔ ] Intégrer le design system
- [ ✔ ] Créer un composant du design system sans framework 
  - [ ✔ ] le tester sémantiquement
  - [ ⨯ ] Tester les interactions client
  - [ ✔ ] Tester l'accessibilité
- [ ✔ ] Créer un composant en dehors sans framework
- [ ] Identifier les outils de développement (linting CSS, webpack / vite)
- [ ✔ ] Creuser la possibilité de faire du hot reload
- [ ] Refactoring entre presenters et template ?

## Résultats
- On peut intégrer le design system en l'installant avec yarn puis en le copiant dans public. On y fait référence en pointant dans /public
- Nous avons réussi à créer des 

## Conclusion
*Did the results match the hypothesis?*

*Or did they contradict the hypothesis?*

*And was the result clear enough?*

- [ ] VALIDATED ✅
- [ ] INVALIDATED ❌
- [ ] INCONCLUSIVE 🤷‍

## Next steps
*And now, what? What would be our next steps?*
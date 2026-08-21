# Étape 1 — L'état et les listes

**8 tests sur 19 passent.** C'est normal : les 11 autres concernent l'étape 2.

```bash
npm run dev
npm test
```

## Ce qui marche

Ajouter, cocher, supprimer. La liste vit.

## Ce qui ne marche pas encore

Les filtres s'affichent mais ne filtrent rien (étape 2). Le renommage n'est pas
branché (étape 2). Rien n'est enregistré : recharge la page et tout disparaît
(étape 3).

## Les 3 idées de cette étape

**L'immutabilité.** `push` modifie le tableau existant. React compare les
références pour décider s'il refait le rendu : même référence, même écran.
`[...taches, t]` crée un tableau neuf, donc une nouvelle référence.

**Les clés stables.** `key={tache.id}`, jamais `key={index}`. La clé dit à React
quel composant correspond à quelle donnée. Avec l'index, supprimer un élément du
milieu décale tout et React associe les composants aux mauvaises données.

**La logique hors des composants.** `App.tsx` ne sait pas *comment* on ajoute une
tâche : il appelle `Taches.ajouter` et range le résultat. C'est ce qui permet
aux tests de tourner sans navigateur.

## À vérifier avant de passer à l'étape 2

- [ ] J'explique pourquoi `push` ne rafraîchit pas l'écran
- [ ] J'explique ce que fait la prop `key` pour React
- [ ] Je sais pourquoi `basculer` renvoie l'objet d'origine pour les tâches non concernées
- [ ] Je comprends `setTaches(p => ...)` et pourquoi c'est préférable

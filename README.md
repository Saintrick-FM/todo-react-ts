# Étape 2 — Les valeurs dérivées

**Les 19 tests passent.** Toute la logique métier est écrite.

```bash
npm run dev
npm test
```

## Ce qui marche

Tout, sauf la persistance. Filtres, compteur, tri, renommage, nettoyage des
tâches terminées.

## L'idée centrale

**Deux états seulement** : `taches` et `filtre`.

La liste affichée et le compteur ne sont pas des états — ce sont des **calculs**.
Ils se recalculent à chaque rendu et ne peuvent donc jamais se désynchroniser.

Le test le plus important du fichier de tests est celui-ci :

```ts
it("ne modifie jamais la liste d'origine", () => {
  filtrer(liste, "faites");
  expect(liste).toHaveLength(3);
});
```

Il verrouille le bug de perte de données. Va voir `revue-de-code` pour observer
ce qui arrive quand on ne respecte pas cette règle.

## `reduce`, enfin utile

`compter` parcourt la liste une seule fois pour produire une valeur agrégée.
C'est exactement le cas d'usage de `reduce` — pas « une boucle en plus
compliqué », mais « réduire une liste à une valeur ».

## À vérifier avant de passer à l'étape 3

- [ ] J'explique pourquoi stocker la liste filtrée fait perdre des données
- [ ] Je sais dire quand une valeur mérite un état, et quand elle doit être calculée
- [ ] J'explique pourquoi `trier` copie le tableau avant d'appeler `sort`
- [ ] Je sais dire à quoi sert `useMemo` — et pourquoi il ne sert à rien ici

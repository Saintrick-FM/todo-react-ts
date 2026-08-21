# Atelier React — l'application de tâches

Un atelier en 4 étapes pour maîtriser les hooks React, les méthodes de tableau
JavaScript, l'immutabilité et la persistance dans le navigateur.

**L'interface est déjà écrite.** Tu n'écris que la logique.

---

## Démarrer

```bash
npm install
npm run dev          # http://localhost:5173
npm run test:watch   # tes tests, en direct
```

Au premier lancement l'application affiche des données figées et ne réagit à
rien. C'est normal : c'est ton point de départ.

---

## Comment travailler

Ouvre `src/lib/taches.ts` et lance `npm run test:watch`.

**Les 19 tests sont déjà écrits et ils sont rouges.** Ils décrivent exactement
le comportement attendu de chaque fonction. Implémente, regarde passer au vert,
continue.

Travailler contre une suite de tests, c'est ce que tu feras en entreprise : la
spécification est exécutable, et elle te prévient quand tu casses ce qui
marchait. Ici, ça te donne surtout un retour immédiat sans avoir à m'attendre.

---

## Les branches

| Branche | Ce qu'elle contient |
|---|---|
| **`main`** | Le point de départ — interface complète, logique à écrire |
| `etape-1-etat-et-listes` | Corrigé de l'étape 1 |
| `etape-2-filtres-derives` | Corrigé de l'étape 2 |
| `etape-3-persistance` | Corrigé de l'étape 3 |
| `etape-4-hook-personnalise` | Corrigé de l'étape 4 |
| **`revue-de-code`** | Du code volontairement cassé — un exercice à part |
| **`solution`** | L'implémentation de référence, commentée et testée |

**Consigne :** ne va voir l'étape suivante qu'après avoir buté au moins vingt
minutes. Regarder trop tôt donne la sensation d'avoir compris ; c'est une
illusion qui s'effondre au premier exercice suivant.

```bash
git switch etape-1-etat-et-listes   # aller voir un corrigé
git switch main                     # revenir à ton travail
```

---

## Les 4 étapes

### Étape 1 — L'état et les listes

`creerTache` · `ajouter` · `basculer` · `supprimer`, puis brancher `App.tsx`.

Ce que tu vas rencontrer : pourquoi `push` ne rafraîchit pas l'écran, pourquoi
`key={index}` casse à la suppression, comment `map` et `filter` reconstruisent
un tableau au lieu de le modifier.

### Étape 2 — Les valeurs dérivées

`filtrer` · `compter` · `trier` · `renommer` · `viderFaites`, puis les filtres
dans `App.tsx`.

La règle centrale de l'atelier : **une valeur qui se déduit d'autres valeurs
n'a pas à vivre dans un état.** On la recalcule. Stocker la liste filtrée est le
bug le plus courant de ce projet, et il fait perdre des données.

### Étape 3 — La persistance

Écrire `useStockageLocal`. Initialisation paresseuse, `useEffect` pour
synchroniser, gestion des cas où le stockage échoue.

Ce que tu vas comprendre : à quoi sert vraiment `useEffect`, et à quoi il ne
sert pas.

### Étape 4 — Le hook métier

Écrire `useTaches` et vider `App.tsx` de toute sa logique. À la fin, `App.tsx`
ne contient plus que du JSX.

---

## L'exercice de revue de code

Séparé des étapes, à faire en fin de semaine :

```bash
git switch revue-de-code
```

Une application qui a l'air de marcher, et qui ne marche pas. Ta mission :
trouver au moins 8 problèmes et expliquer chacun. Tout est décrit dans le README
de cette branche.

---

## Ce que tu dois savoir défendre à la fin

Si tu ne peux pas répondre à ces questions sans regarder le code, l'étape n'est
pas acquise :

1. Pourquoi `taches.push(t)` suivi de `setTaches(taches)` ne rafraîchit rien ?
2. Que se passe-t-il exactement, en mémoire, avec `key={index}` quand on
   supprime un élément du milieu ?
3. Pourquoi ne stocke-t-on jamais la liste filtrée dans un état ?
4. Quelle est la différence entre `useState(lire())` et `useState(() => lire())` ?
5. À quoi sert un `useEffect` — et à quoi il ne sert pas ?
6. Pourquoi la logique métier est-elle hors des composants ?
7. Pourquoi une case à cocher doit-elle avoir un attribut `checked` ?
8. Pourquoi `onSubmit` sur le formulaire plutôt que `onClick` sur le bouton ?

---

## Ce projet n'ira jamais dans ton portfolio

C'est le projet le plus répandu du monde. Un recruteur qui voit une liste de
tâches ferme l'onglet.

Sa valeur est ailleurs : il t'apprend les réflexes que tu appliqueras sur les
trois vrais projets. Il sera archivé après la semaine 2.

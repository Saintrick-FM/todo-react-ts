# Étape 4 — Le hook métier

**Les 19 tests passent.** L'architecture est en place.

```bash
npm run dev
npm test
```

## Ce qui change

`App.tsx` passe de ~110 lignes à ~60, et surtout : il ne contient plus **aucune
logique**. Compare :

```bash
git diff etape-3-persistance etape-4-hook-personnalise -- src/App.tsx
```

Toute la mécanique a déménagé dans `src/hooks/useTaches.ts`. Le composant écrit
maintenant une seule ligne :

```ts
const { tachesVisibles, filtre, stats, ajouter, basculer, ... } = useTaches();
```

## Les trois couches

```
lib/taches.ts        LES RÈGLES      fonctions pures, zéro React, testables
hooks/useTaches.ts   L'ÉTAT          état React, persistance, actions
components/*         L'AFFICHAGE     aucune logique métier
```

Chaque couche peut changer sans toucher aux autres. Change le design : `lib/` ne
bouge pas. Passe de `localStorage` à une base de données : les composants ne
bougent pas.

C'est le découpage qu'on retrouve dans à peu près toute application sérieuse.
Le vocabulaire varie, l'idée reste : **séparer ce qui décide de ce qui affiche**.

## Ce que ça t'apporte en entretien

Un junior sait faire marcher une TODO list. Ce qui distingue un candidat, c'est
de pouvoir dire *pourquoi* le code est rangé ainsi — et ce qu'on gagne à le
ranger autrement.

Prépare une réponse de deux minutes à : « explique-moi l'architecture de ce
projet ».

## À vérifier avant la revue de code

- [ ] Je nomme les trois couches et ce que chacune contient
- [ ] J'explique pourquoi la logique métier ne vit pas dans les composants
- [ ] Je sais dire ce qu'un hook personnalisé apporte concrètement
- [ ] Je peux présenter cette architecture en deux minutes, sans notes

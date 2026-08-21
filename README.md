# Étape 3 — La persistance

**Les 19 tests passent.** Les tâches survivent maintenant au rechargement.

```bash
npm run dev     # ajoute des tâches, recharge la page
npm test
```

## Ce qui change

Une seule ligne, en réalité : `useState` devient `useStockageLocal`.

Toute la mécanique est enfermée dans `src/hooks/useStockageLocal.ts` — lecture
initiale, écriture, validation, gestion des erreurs. `App.tsx` ne sait même pas
qu'il y a un stockage derrière.

C'est ça, un bon hook : il fait disparaître une complexité sans la déplacer
ailleurs.

## Les trois pièges de cette étape

**L'initialisation paresseuse.** `useState(() => lire())` et non
`useState(lire())`. Sans la fonction, l'expression est évaluée à chaque rendu —
donc lecture du stockage et `JSON.parse` à chaque frappe au clavier.

**Le tableau de dépendances.** L'oublier fait tourner l'effet à chaque rendu. Y
mettre une valeur recréée à chaque rendu (un objet, une fonction) crée une boucle
infinie. Teste-le pour voir.

**Le stockage peut échouer.** En navigation privée, quand le quota est plein, ou
quand l'utilisateur bloque les données de site, chaque appel lève une exception.
Un `getItem` non protégé dans un composant, et c'est la page blanche. D'où le
`try/catch` dans `lib/stockage.ts`.

## À quoi sert `useEffect`

À **synchroniser React avec quelque chose d'extérieur**. Ici, le stockage du
navigateur. Plus tard : une connexion réseau, un abonnement, un minuteur.

Il ne sert **pas** à calculer une valeur dérivée de l'état. `tachesVisibles` est
calculé pendant le rendu, pas dans un effet. C'est la confusion la plus
répandue chez les débutants en React, et elle produit du code impossible à
suivre.

À lire : [Vous n'avez peut-être pas besoin d'un
Effet](https://fr.react.dev/learn/you-might-not-need-an-effect).

## Une observation à faire

Ouvre les outils de développement, onglet Application → Local Storage.
Regarde le contenu changer en direct pendant que tu coches des tâches.

Puis pose-toi la question : que se passe-t-il si tu ouvres l'application sur
ton téléphone ? Sur un autre navigateur ? Si tu vides ton cache ?

Cette limite est exactement ce qui justifiera une vraie base de données en
semaine 5. Tu viens de vivre le problème avant d'en apprendre la solution.

## À vérifier avant de passer à l'étape 4

- [ ] J'explique la différence entre `useState(lire())` et `useState(() => lire())`
- [ ] Je sais ce que provoque un tableau de dépendances mal rempli
- [ ] J'explique à quoi sert `useEffect`, et à quoi il ne sert pas
- [ ] Je sais pourquoi on valide ce qu'on relit du stockage

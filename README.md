# Solution de référence

Branche `solution` — l'implémentation complète, telle qu'on l'écrirait en entreprise.

## Lancer

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 19 tests sur la logique métier
npm run lint     # vérification TypeScript
```

## L'architecture, en trois couches

```
src/
├── types.ts              Le vocabulaire du domaine. Écrit en premier.
│
├── lib/                  LES RÈGLES — fonctions pures, zéro React
│   ├── taches.ts         ajouter, basculer, filtrer, compter, trier…
│   ├── taches.test.ts    19 tests, sans navigateur ni composant monté
│   └── stockage.ts       accès localStorage sécurisé et isolé
│
├── hooks/                L'ÉTAT — la mécanique React
│   ├── useStockageLocal.ts   un useState qui survit au rechargement
│   └── useTaches.ts          l'état de l'app et les actions permises
│
├── components/           L'AFFICHAGE — aucune logique métier
│   ├── FormulaireAjout.tsx
│   ├── Filtres.tsx
│   ├── ListeTaches.tsx
│   ├── LigneTache.tsx
│   ├── EtatVide.tsx
│   └── Stats.tsx
│
└── App.tsx               La composition. ~60 lignes, que du JSX.
```

**Pourquoi ce découpage.** Les règles du produit sont dans `lib/`, testables en
quelques lignes parce qu'elles ne dépendent de rien. L'état vit dans `hooks/`.
Les composants affichent. Chaque couche peut changer sans toucher aux autres —
et en semaine 5, les fonctions de `lib/taches.ts` descendront côté serveur
presque telles quelles.

## Les décisions à savoir défendre

| Décision | Pourquoi |
|---|---|
| Logique métier hors des composants | Testable sans monter React |
| `[...taches, t]` jamais `push` | React compare les références pour décider de re-rendre |
| Liste filtrée **calculée**, jamais stockée | Deux sources de vérité finissent toujours par diverger |
| `crypto.randomUUID()` | `length + 1` recrée des identifiants déjà pris |
| `key={tache.id}` | Avec l'index, supprimer au milieu décale l'état des lignes |
| Case à cocher contrôlée (`checked` + `onChange`) | Sinon le navigateur gère l'affichage dans son coin |
| `onSubmit` sur le `<form>` | Sinon la touche Entrée recharge la page |
| Un seul `useEffect`, pour le stockage | Un effet synchronise avec l'extérieur ; il ne calcule pas |
| `useState(() => lire())` | Sans la fonction, on relit le stockage à chaque rendu |
| `<button aria-label>` et non `<i onClick>` | Un `<i>` n'est pas atteignable au clavier |
| `aria-live` sur le compteur | Sans ça, aucun retour pour un utilisateur non-voyant |

## Ce que `useMemo` et `useCallback` font ici

Ils sont présents pour que tu saches les écrire — pas parce qu'ils sont
nécessaires. Sur trente tâches, ils n'apportent rien de mesurable.

**On n'optimise pas ce qu'on n'a pas mesuré.** Un `useMemo` posé « au cas où »
coûte une ligne à lire et une dépendance à maintenir, en échange de rien.

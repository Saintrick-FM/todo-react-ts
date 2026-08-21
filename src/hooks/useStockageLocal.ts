import { useEffect, useState } from "react";
import { ecrire, lire } from "../lib/stockage";

/**
 * ÉTAPE 3 — un état React qui survit au rechargement de la page.
 *
 * S'utilise exactement comme `useState` :
 *   const [taches, setTaches] = useStockageLocal("taches", [], estTableauDeTaches);
 *
 * Un hook personnalisé n'est rien d'autre qu'une fonction dont le nom commence
 * par « use » et qui appelle d'autres hooks. Aucune magie.
 *
 * ┌─ CE QU'IL TE FAUT ──────────────────────────────────────────────────┐
 * │                                                                      │
 * │ 1. Un `useState` initialisé DEPUIS le stockage, en INITIALISATION    │
 * │    PARESSEUSE :                                                      │
 * │                                                                      │
 * │      useState(lire(...))        ← lit à CHAQUE rendu                 │
 * │      useState(() => lire(...))  ← lit une seule fois, au montage     │
 * │                                                                      │
 * │    Dans le premier cas React ignore la valeur après le premier       │
 * │    rendu, mais l'expression est quand même évaluée à chaque fois :   │
 * │    lecture du stockage + JSON.parse à chaque frappe au clavier.      │
 * │                                                                      │
 * │ 2. Un `useEffect` qui écrit la valeur quand elle change.             │
 * │                                                                      │
 * │    Un effet sert à SYNCHRONISER React avec quelque chose             │
 * │    d'extérieur — ici le stockage du navigateur. C'est son rôle       │
 * │    exact. Il ne sert PAS à calculer une valeur dérivée de l'état.    │
 * │                                                                      │
 * │    Attention au tableau de dépendances : l'oublier = l'effet tourne  │
 * │    à chaque rendu. Y mettre une valeur recréée à chaque rendu        │
 * │    (objet, fonction) = boucle infinie.                               │
 * │                                                                      │
 * │ 3. Renvoyer `[valeur, setValeur] as const` pour que TypeScript       │
 * │    infère un tuple et non un tableau.                                │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * `lire` et `ecrire` te sont fournis dans src/lib/stockage.ts — lis ce fichier,
 * il explique pourquoi on n'appelle jamais `localStorage` directement.
 */
export function useStockageLocal<T>(
  cle: string,
  valeurParDefaut: T,
  estValide: (v: unknown) => v is T
) {
  throw new Error("À implémenter — étape 3");
  // Supprime la ligne ci-dessus et écris le hook.
}

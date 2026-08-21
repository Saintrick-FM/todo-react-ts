import { useMemo } from "react";
import { useStockageLocal } from "./useStockageLocal";
import * as Taches from "../lib/taches";
import type { Filtre, Tache } from "../types";

const CLE_TACHES = "atelier.taches";
const CLE_FILTRE = "atelier.filtre";

/**
 * Vérifie qu'une valeur relue du stockage a bien la forme attendue.
 * FOURNI — lis-le, ne le réécris pas.
 *
 * La signature `v is Tache[]` est un « prédicat de type » : si la fonction
 * renvoie `true`, TypeScript traitera `v` comme un `Tache[]` dans la suite.
 *
 * Pourquoi valider ? Parce qu'on ne fait jamais confiance à ce qu'on relit.
 * C'est une donnée venue de l'extérieur du programme, au même titre qu'une
 * réponse d'API. Même principe qu'en semaine 4 avec Zod, côté serveur.
 */
function estTableauDeTaches(v: unknown): v is Tache[] {
  return (
    Array.isArray(v) &&
    v.every(
      (t) =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as Tache).id === "string" &&
        typeof (t as Tache).titre === "string" &&
        typeof (t as Tache).faite === "boolean"
    )
  );
}

function estFiltre(v: unknown): v is Filtre {
  return v === "toutes" || v === "a-faire" || v === "faites";
}

/**
 * ÉTAPE 4 — le hook métier : tout l'état de l'application et les actions
 * permises, rassemblés à un seul endroit.
 *
 * Objectif : qu'App.tsx n'ait plus à savoir comment on ajoute, filtre ou
 * persiste une tâche. Il écrit `const { tachesVisibles, ajouter } = useTaches()`
 * et il compose l'interface. Rien d'autre.
 *
 * ┌─ CE QUE CE HOOK DOIT CONTENIR ──────────────────────────────────────┐
 * │                                                                      │
 * │ • `taches` et `filtre`, via useStockageLocal (étape 3)               │
 * │                                                                      │
 * │ • `tachesVisibles` — DÉRIVÉE, jamais stockée dans un état.           │
 * │   C'est le point central : `Taches.trier(Taches.filtrer(...))`,      │
 * │   calculé pendant le rendu. Impossible à désynchroniser puisque      │
 * │   cette valeur n'existe jamais séparément.                           │
 * │                                                                      │
 * │ • `stats` — dérivée elle aussi, via `Taches.compter`.                │
 * │                                                                      │
 * │ • les actions : ajouter, basculer, supprimer, renommer, viderFaites. │
 * │   Chacune délègue la règle à lib/taches.ts et range le résultat.     │
 * │                                                                      │
 * │   Utilise la forme FONCTION du setter :                              │
 * │       setTaches(precedentes => Taches.ajouter(precedentes, titre))   │
 * │   plutôt que                                                         │
 * │       setTaches(Taches.ajouter(taches, titre))                       │
 * │   La première garantit de partir de la valeur la plus récente, même  │
 * │   si plusieurs mises à jour s'enchaînent dans le même cycle.         │
 * │                                                                      │
 * │ • À propos de useMemo : sur trente tâches il n'apporte rien de       │
 * │   mesurable. Écris-le une fois pour savoir le faire, mais retiens    │
 * │   la règle : on n'optimise pas ce qu'on n'a pas mesuré.              │
 * └──────────────────────────────────────────────────────────────────────┘
 */
export function useTaches() {
  throw new Error("À implémenter — étape 4");
}

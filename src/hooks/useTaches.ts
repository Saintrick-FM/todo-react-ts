import { useCallback, useMemo } from "react";
import { useStockageLocal } from "./useStockageLocal";
import * as Taches from "../lib/taches";
import type { Filtre, Tache } from "../types";

const CLE_TACHES = "atelier.taches";
const CLE_FILTRE = "atelier.filtre";

/**
 * Vérifie qu'une valeur relue du stockage a bien la forme attendue.
 *
 * La signature `v is Tache[]` est un « prédicat de type » : elle indique à
 * TypeScript que si cette fonction renvoie `true`, alors `v` peut être traité
 * comme un `Tache[]` dans la suite du code.
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
 * Le hook métier : tout l'état de l'application, et les actions permises.
 *
 * ┌─ CE QUE CE HOOK APPORTE ──────────────────────────────────────────────┐
 * │ App.tsx n'a plus à savoir comment on ajoute, filtre ou persiste une   │
 * │ tâche. Il demande `const { tachesVisibles, ajouter } = useTaches()`   │
 * │ et il compose l'interface.                                            │
 * │                                                                       │
 * │ On obtient trois couches nettes :                                     │
 * │   lib/taches.ts   → les règles, pures, testables                      │
 * │   hooks/useTaches → l'état React et la persistance                    │
 * │   components/*    → l'affichage, sans logique                         │
 * │                                                                       │
 * │ C'est le découpage qu'on retrouve dans à peu près toute application   │
 * │ sérieuse. Le nommage change, l'idée reste : séparer ce qui décide de  │
 * │ ce qui affiche.                                                       │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export function useTaches() {
  const [taches, setTaches] = useStockageLocal<Tache[]>(CLE_TACHES, [], estTableauDeTaches);
  const [filtre, setFiltre] = useStockageLocal<Filtre>(CLE_FILTRE, "toutes", estFiltre);

  /* ┌─ VALEURS DÉRIVÉES ──────────────────────────────────────────────────┐
     │ `tachesVisibles` et `stats` se DÉDUISENT de `taches` et `filtre`.   │
     │ Elles ne sont donc pas des états : on les recalcule pendant le      │
     │ rendu. Impossible de les désynchroniser, puisqu'elles n'existent    │
     │ jamais séparément.                                                  │
     │                                                                     │
     │ À propos de useMemo : il évite de refaire le calcul quand rien n'a  │
     │ changé. Sur une liste de trente tâches, il ne sert strictement à    │
     │ rien — le tri coûte quelques microsecondes. Il est ici pour que tu  │
     │ saches l'écrire, pas parce que c'est nécessaire.                    │
     │                                                                     │
     │ Règle : on n'optimise pas ce qu'on n'a pas mesuré. Un useMemo posé  │
     │ « au cas où » ajoute du code à lire et une dépendance à maintenir,  │
     │ en échange de rien.                                                 │
     └─────────────────────────────────────────────────────────────────────┘ */
  const tachesVisibles = useMemo(
    () => Taches.trier(Taches.filtrer(taches, filtre)),
    [taches, filtre]
  );

  const stats = useMemo(() => Taches.compter(taches), [taches]);

  /* Les actions. Chacune délègue la règle métier à lib/taches.ts et se
     contente de ranger le résultat dans l'état.

     `setTaches(precedentes => ...)` — la forme FONCTION plutôt que
     `setTaches(Taches.ajouter(taches, titre))`. Elle garantit qu'on part
     toujours de la valeur la plus récente, même si plusieurs mises à jour
     s'enchaînent dans le même cycle. C'est le réflexe à prendre.

     `useCallback` conserve la même référence de fonction entre les rendus.
     Comme pour useMemo : utile quand on passe ces fonctions à des composants
     mémoïsés, superflu ici. Présent pour que tu en connaisses la forme. */
  const ajouter = useCallback(
    (titre: string) => setTaches((p) => Taches.ajouter(p, titre)),
    [setTaches]
  );

  const basculer = useCallback(
    (id: string) => setTaches((p) => Taches.basculer(p, id)),
    [setTaches]
  );

  const supprimer = useCallback(
    (id: string) => setTaches((p) => Taches.supprimer(p, id)),
    [setTaches]
  );

  const renommer = useCallback(
    (id: string, titre: string) => setTaches((p) => Taches.renommer(p, id, titre)),
    [setTaches]
  );

  const viderFaites = useCallback(
    () => setTaches((p) => Taches.viderFaites(p)),
    [setTaches]
  );

  return {
    taches,
    tachesVisibles,
    filtre,
    stats,
    setFiltre,
    ajouter,
    basculer,
    supprimer,
    renommer,
    viderFaites,
  };
}

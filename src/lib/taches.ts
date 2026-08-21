import type { Filtre, Tache } from "../types";

/* ==========================================================================
   LA LOGIQUE MÉTIER, EN FONCTIONS PURES.

   Aucun import de React dans ce fichier. C'est délibéré, et c'est le choix
   d'architecture le plus important du projet.

   Une fonction PURE, c'est :
     1. mêmes entrées → mêmes sorties, toujours ;
     2. aucun effet de bord (elle ne touche ni au DOM, ni au stockage,
        ni au réseau, et ne modifie pas ses arguments).

   Ce que ça t'apporte concrètement :
     • testable en une ligne, sans navigateur ni composant monté ;
     • réutilisable ailleurs — en semaine 5, ces règles descendront côté
       serveur presque telles quelles ;
     • lisible : les règles du produit sont rassemblées ici, pas éparpillées
       dans six composants.

   Regarde src/lib/taches.test.ts : c'est parce que ces fonctions sont pures
   que les tests tiennent en quelques lignes.
   ========================================================================== */

/**
 * Crée une tâche.
 *
 * `crypto.randomUUID()` produit un identifiant unique, disponible nativement
 * dans tous les navigateurs modernes.
 *
 * Surtout PAS `id: taches.length + 1` : supprime la tâche du milieu, ajoute-en
 * une nouvelle, et tu recrées un identifiant déjà pris. Deux tâches partagent
 * alors le même id — et cocher l'une coche l'autre.
 */
export function creerTache(titre: string): Tache {
  return {
    id: crypto.randomUUID(),
    titre: titre.trim(),
    faite: false,
    creeeLe: new Date().toISOString(),
  };
}

/**
 * Ajoute une tâche et renvoie un NOUVEAU tableau.
 *
 * ┌─ POURQUOI PAS `taches.push(tache)` ? ─────────────────────────────────┐
 * │ `push` modifie le tableau existant : la variable pointe toujours vers │
 * │ le même objet en mémoire. React compare les références (===) pour     │
 * │ décider s'il doit refaire le rendu. Même référence → il en conclut    │
 * │ que rien n'a changé → l'écran ne bouge pas.                           │
 * │                                                                       │
 * │ Le symptôme est déroutant : la donnée EST bien modifiée (un           │
 * │ console.log le confirme), mais l'affichage l'ignore.                  │
 * │                                                                       │
 * │ `[...taches, tache]` crée un tableau neuf, donc une nouvelle          │
 * │ référence, donc un nouveau rendu.                                     │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export function ajouter(taches: Tache[], titre: string): Tache[] {
  return [...taches, creerTache(titre)];
}

/**
 * Inverse l'état « faite » d'une tâche.
 *
 * `map` reconstruit le tableau. Pour la tâche visée on renvoie une copie
 * modifiée (`{ ...t, faite: !t.faite }`), pour les autres on renvoie l'objet
 * d'origine inchangé — ce qui permet à React d'éviter de re-rendre les lignes
 * qui n'ont pas bougé.
 */
export function basculer(taches: Tache[], id: string): Tache[] {
  return taches.map((t) => (t.id === id ? { ...t, faite: !t.faite } : t));
}

/** Supprime une tâche. `filter` renvoie naturellement un nouveau tableau. */
export function supprimer(taches: Tache[], id: string): Tache[] {
  return taches.filter((t) => t.id !== id);
}

/** Renomme une tâche. Un titre vide est ignoré plutôt que d'être enregistré. */
export function renommer(taches: Tache[], id: string, titre: string): Tache[] {
  const propre = titre.trim();
  if (propre.length === 0) return taches;
  return taches.map((t) => (t.id === id ? { ...t, titre: propre } : t));
}

/** Retire toutes les tâches terminées. */
export function viderFaites(taches: Tache[]): Tache[] {
  return taches.filter((t) => !t.faite);
}

/**
 * Applique un filtre.
 *
 * ┌─ LE PIÈGE N°1 DE CE PROJET ───────────────────────────────────────────┐
 * │ Cette fonction CALCULE la liste visible. On ne la stocke jamais.      │
 * │                                                                       │
 * │ La tentation est d'écrire `const [tachesVisibles, setTachesVisibles]  │
 * │ = useState([])` et de la remplir à chaque changement de filtre. Ça     │
 * │ crée une deuxième source de vérité, qui se désynchronise dès que la   │
 * │ première change.                                                      │
 * │                                                                       │
 * │ Le scénario réel : on filtre sur « À faire », puis on ajoute une      │
 * │ tâche à partir de la liste filtrée — et toutes les tâches terminées   │
 * │ disparaissent. Perte de données pure et simple.                       │
 * │                                                                       │
 * │ Règle générale : si une valeur peut se DÉDUIRE d'autres valeurs,      │
 * │ elle ne doit pas vivre dans un état. On la recalcule.                 │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export function filtrer(taches: Tache[], filtre: Filtre): Tache[] {
  switch (filtre) {
    case "a-faire":
      return taches.filter((t) => !t.faite);
    case "faites":
      return taches.filter((t) => t.faite);
    case "toutes":
      return taches;
  }
  // Pas de `default` : le type union `Filtre` garantit qu'on a traité tous les
  // cas. Si tu ajoutes une valeur au type, TypeScript signalera ce switch.
}

/**
 * Compte les tâches par état.
 *
 * `reduce` en une seule passe plutôt que deux `filter().length`.
 * Sur trente tâches la différence est nulle — l'intérêt ici est de
 * comprendre `reduce` sur un cas où il est réellement le bon outil :
 * réduire une liste à UNE valeur agrégée.
 */
export function compter(taches: Tache[]): { total: number; faites: number; restantes: number } {
  const faites = taches.reduce((somme, t) => somme + (t.faite ? 1 : 0), 0);
  return {
    total: taches.length,
    faites,
    restantes: taches.length - faites,
  };
}

/**
 * Trie : les tâches à faire d'abord, puis les plus récentes en tête.
 *
 * `[...taches]` avant `.sort()` : `sort` modifie le tableau SUR PLACE.
 * L'appeler directement sur les props reviendrait à muter l'état du parent —
 * le même problème que `push`, en plus discret.
 */
export function trier(taches: Tache[]): Tache[] {
  return [...taches].sort((a, b) => {
    if (a.faite !== b.faite) return a.faite ? 1 : -1;
    return b.creeeLe.localeCompare(a.creeeLe);
  });
}

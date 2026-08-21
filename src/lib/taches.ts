import type { Filtre, Tache } from "../types";

/* ==========================================================================
   LA LOGIQUE MÉTIER — C'EST ICI QUE TU COMMENCES.

   Toutes les fonctions de ce fichier sont PURES :
     • mêmes entrées → mêmes sorties, toujours ;
     • aucun effet de bord : elles ne touchent ni au DOM, ni au stockage,
       et surtout elles NE MODIFIENT PAS leurs arguments.

   Aucun import de React ici. C'est volontaire : ces règles doivent pouvoir
   être testées sans navigateur et sans composant monté.

   ┌─ COMMENT TRAVAILLER ────────────────────────────────────────────────┐
   │ Le fichier taches.test.ts contient déjà les 19 tests qui décrivent   │
   │ le comportement attendu. Ils sont ROUGES pour l'instant.             │
   │                                                                      │
   │   npm run test:watch                                                 │
   │                                                                      │
   │ Implémente une fonction, regarde son test passer au vert, continue.  │
   │ Les tests sont ta spécification : ils te disent quoi faire, et te    │
   │ préviennent quand tu casses ce qui marchait.                         │
   └──────────────────────────────────────────────────────────────────────┘
   ========================================================================== */

/**
 * Crée une tâche à partir d'un titre.
 *
 * ATTENTION à l'identifiant. `taches.length + 1` semble suffire, mais :
 * supprime la tâche du milieu, ajoute-en une nouvelle, et tu recrées un
 * identifiant déjà pris. Deux tâches partagent alors le même id, et cocher
 * l'une coche l'autre.
 * Cherche `crypto.randomUUID` dans la doc MDN.
 *
 * Pense aussi à nettoyer les espaces autour du titre.
 */
export function creerTache(titre: string): Tache {
  throw new Error("À implémenter — étape 1");
}

/**
 * Ajoute une tâche et renvoie un NOUVEAU tableau.
 *
 * Le réflexe naturel est `taches.push(tache)`. Écris-le, lance l'application,
 * et observe : la donnée change, l'écran non.
 *
 * Raison : `push` modifie le tableau existant, donc la variable pointe
 * toujours vers le même objet en mémoire. React compare les références (===)
 * pour décider s'il doit refaire le rendu. Même référence → il en conclut que
 * rien n'a changé.
 *
 * Il te faut un tableau NEUF. Cherche l'opérateur de décomposition (`...`).
 */
export function ajouter(taches: Tache[], titre: string): Tache[] {
  throw new Error("À implémenter — étape 1");
}

/**
 * Inverse l'état « faite » d'une tâche.
 *
 * Même règle : on ne modifie rien sur place. `map` reconstruit le tableau.
 * Pour la tâche visée, renvoie une COPIE modifiée (`{ ...t, faite: ... }`).
 * Pour les autres, renvoie l'objet d'origine tel quel.
 */
export function basculer(taches: Tache[], id: string): Tache[] {
  throw new Error("À implémenter — étape 1");
}

/** Supprime une tâche. `filter` renvoie naturellement un nouveau tableau. */
export function supprimer(taches: Tache[], id: string): Tache[] {
  throw new Error("À implémenter — étape 1");
}

/** Renomme une tâche. Un titre vide doit être ignoré, pas enregistré. */
export function renommer(taches: Tache[], id: string, titre: string): Tache[] {
  throw new Error("À implémenter — étape 2");
}

/** Retire toutes les tâches terminées. */
export function viderFaites(taches: Tache[]): Tache[] {
  throw new Error("À implémenter — étape 2");
}

/**
 * Applique un filtre et renvoie la liste à afficher.
 *
 * ┌─ LE PIÈGE PRINCIPAL DU PROJET ──────────────────────────────────────┐
 * │ Cette fonction CALCULE la liste visible. On ne la stockera jamais    │
 * │ dans un état.                                                        │
 * │                                                                      │
 * │ La tentation sera d'écrire, dans App.tsx :                           │
 * │   const [tachesVisibles, setTachesVisibles] = useState([])           │
 * │ et de la remplir à chaque changement de filtre. Ça crée une DEUXIÈME │
 * │ source de vérité, qui se désynchronise dès que la première change.   │
 * │                                                                      │
 * │ Tu peux voir le résultat en action sur la branche `revue-de-code`.   │
 * │                                                                      │
 * │ Règle : une valeur qui peut se DÉDUIRE d'autres valeurs ne doit pas  │
 * │ vivre dans un état. On la recalcule.                                 │
 * └──────────────────────────────────────────────────────────────────────┘
 */
export function filtrer(taches: Tache[], filtre: Filtre): Tache[] {
  throw new Error("À implémenter — étape 2");
}

/**
 * Compte les tâches par état, en UNE seule passe.
 *
 * Tu peux écrire deux `filter().length`. Fais-le d'abord si ça t'aide.
 * Puis réécris-le avec `reduce` : c'est exactement le cas où `reduce` est le
 * bon outil — réduire une liste à UNE valeur agrégée.
 */
export function compter(taches: Tache[]): { total: number; faites: number; restantes: number } {
  throw new Error("À implémenter — étape 2");
}

/**
 * Trie : les tâches à faire d'abord, puis les plus récentes en tête.
 *
 * PIÈGE : `sort` modifie le tableau SUR PLACE. L'appeler directement sur le
 * tableau reçu revient à muter l'état — le même problème que `push`, en plus
 * discret. Copie avant de trier.
 */
export function trier(taches: Tache[]): Tache[] {
  throw new Error("À implémenter — étape 2");
}

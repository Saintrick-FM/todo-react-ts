/* ==========================================================================
   L'ACCÈS AU STOCKAGE, ISOLÉ DANS UN SEUL FICHIER.

   Pourquoi ne pas appeler `localStorage` directement là où on en a besoin ?

   1. `localStorage` peut ÉCHOUER. En navigation privée sur certains
      navigateurs, quand l'utilisateur bloque les données de site, ou quand le
      quota est plein, chaque appel lève une exception. Un `getItem` non
      protégé dans un composant, et toute l'application affiche une page
      blanche.

   2. Le contenu peut être CORROMPU. `JSON.parse` sur une chaîne invalide lève
      aussi. Et une version précédente de ton application a pu y écrire une
      structure différente.

   3. Isoler l'accès rend le remplacement trivial. En semaine 5, on branchera
      une vraie base de données : seul ce fichier changera.
   ========================================================================== */

/**
 * Lit et analyse une valeur. Renvoie `valeurParDefaut` au moindre problème.
 *
 * Le paramètre `estValide` est important : ne fais jamais confiance à ce que
 * tu relis. C'est une donnée qui vient de l'extérieur de ton programme, au
 * même titre qu'une réponse d'API. On appliquera exactement le même principe
 * en semaine 4 avec Zod, côté serveur.
 */
export function lire<T>(cle: string, valeurParDefaut: T, estValide: (v: unknown) => v is T): T {
  try {
    const brut = window.localStorage.getItem(cle);
    if (brut === null) return valeurParDefaut;

    const analyse: unknown = JSON.parse(brut);
    return estValide(analyse) ? analyse : valeurParDefaut;
  } catch {
    // Stockage indisponible ou JSON invalide : on repart proprement du défaut
    // plutôt que de laisser l'exception casser le rendu.
    return valeurParDefaut;
  }
}

/** Écrit une valeur. Un échec d'écriture ne doit jamais interrompre l'appli. */
export function ecrire<T>(cle: string, valeur: T): void {
  try {
    window.localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    // Quota dépassé ou stockage refusé. L'application continue de fonctionner,
    // simplement sans persistance. En production on remonterait l'erreur à un
    // outil de suivi (Sentry, semaine 11) plutôt que de l'ignorer en silence.
  }
}

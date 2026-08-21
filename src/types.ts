/**
 * Les types du domaine. Un seul endroit, importé partout.
 *
 * Écrire ces types AVANT le code n'est pas une formalité : c'est la première
 * modélisation de données du projet. Les mêmes questions se reposeront en
 * semaine 5 avec Prisma, en bien plus coûteux à corriger.
 */

export type Tache = {
  /** Identifiant stable, généré une seule fois à la création.
   *  Surtout pas l'index dans le tableau, ni `liste.length + 1`. */
  id: string;
  /** Le texte saisi par l'utilisateur, déjà nettoyé de ses espaces. */
  titre: string;
  /** Faite ou pas. */
  faite: boolean;
  /** Date de création au format ISO — utile pour trier. */
  creeeLe: string;
};

/**
 * Un type union plutôt qu'une chaîne libre : TypeScript refusera
 * `filtre === "toute"` (faute de frappe) au lieu de te laisser chercher
 * pendant vingt minutes pourquoi rien ne se passe.
 */
export type Filtre = "toutes" | "a-faire" | "faites";

/** Utilisé pour afficher les libellés des filtres sans les réécrire partout. */
export const LIBELLES_FILTRES: Record<Filtre, string> = {
  toutes: "Toutes",
  "a-faire": "À faire",
  faites: "Faites",
};

import { useEffect, useState } from "react";
import { ecrire, lire } from "../lib/stockage";

/**
 * Hook générique : un état React qui survit au rechargement de la page.
 *
 * S'utilise exactement comme `useState` :
 *   const [taches, setTaches] = useStockageLocal("taches", [], estTableauDeTaches);
 *
 * ┌─ POURQUOI EXTRAIRE UN HOOK ? ─────────────────────────────────────────┐
 * │ Un hook personnalisé, c'est simplement une fonction qui commence par  │
 * │ « use » et qui appelle d'autres hooks. Aucune magie.                  │
 * │                                                                       │
 * │ L'intérêt : la mécanique de persistance (lecture initiale, écriture,  │
 * │ gestion des erreurs) est écrite UNE fois, ici. Les composants qui     │
 * │ l'utilisent n'ont plus à la connaître. Le jour où on change de mode   │
 * │ de stockage, on modifie ce fichier et rien d'autre.                   │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * `<T,>` déclare un type générique : ce hook fonctionne pour n'importe quel
 * type de valeur, tout en gardant le typage précis à l'usage.
 */
export function useStockageLocal<T>(
  cle: string,
  valeurParDefaut: T,
  estValide: (v: unknown) => v is T
) {
  /* ┌─ INITIALISATION PARESSEUSE ─────────────────────────────────────────┐
     │ On passe une FONCTION à useState, pas une valeur.                   │
     │                                                                     │
     │   useState(lire(...))    ← lit le stockage à CHAQUE rendu           │
     │   useState(() => lire(...)) ← lit une seule fois, au montage        │
     │                                                                     │
     │ Dans le premier cas, React ignore la valeur après le premier rendu, │
     │ mais l'expression est quand même évaluée à chaque fois : lecture du │
     │ stockage + JSON.parse à chaque frappe au clavier. Invisible sur une │
     │ petite liste, coûteux dès que ça grossit.                           │
     └─────────────────────────────────────────────────────────────────────┘ */
  const [valeur, setValeur] = useState<T>(() => lire(cle, valeurParDefaut, estValide));

  /* ┌─ LE SEUL useEffect DU PROJET ───────────────────────────────────────┐
     │ Un effet sert à SYNCHRONISER React avec quelque chose d'extérieur : │
     │ ici, le stockage du navigateur. C'est exactement son rôle.          │
     │                                                                     │
     │ Ce à quoi un effet ne sert PAS : calculer une valeur dérivée de     │
     │ l'état. Pour ça on calcule pendant le rendu (voir `filtrer`).       │
     │ Lis « Vous n'avez peut-être pas besoin d'un Effet » sur react.dev.  │
     │                                                                     │
     │ Le tableau de dépendances [cle, valeur] : l'effet se relance quand  │
     │ l'une des deux change. L'oublier = l'effet tourne à chaque rendu ;   │
     │ y mettre une valeur recréée à chaque rendu (objet, fonction) =      │
     │ boucle infinie.                                                     │
     └─────────────────────────────────────────────────────────────────────┘ */
  useEffect(() => {
    ecrire(cle, valeur);
  }, [cle, valeur]);

  return [valeur, setValeur] as const;
}

import type { Tache } from "../types";
import LigneTache from "./LigneTache";

type Props = {
  taches: Tache[];
  onBasculer: (id: string) => void;
  onSupprimer: (id: string) => void;
  onRenommer: (id: string, titre: string) => void;
};

/**
 * Affiche la liste déjà filtrée par le parent.
 *
 * Ce composant ne filtre rien : il reçoit exactement ce qu'il doit afficher.
 * Répartir la responsabilité ainsi évite qu'une même règle métier se retrouve
 * écrite à trois endroits différents.
 */
export default function ListeTaches({
  taches,
  onBasculer,
  onSupprimer,
  onRenommer,
}: Props) {
  return (
    <ul className="liste">
      {taches.map((tache) => (
        /* ┌─ LA CLÉ ─────────────────────────────────────────────────────┐
           │ key={tache.id} — un identifiant STABLE, propre à la donnée.  │
           │                                                              │
           │ key={index} est le piège classique. La clé sert à React pour │
           │ savoir quel composant correspond à quelle donnée entre deux  │
           │ rendus. Avec l'index, supprimer un élément du milieu décale  │
           │ tout : React croit que l'élément n'a pas bougé, garde son    │
           │ état interne et son DOM, et l'associe à une AUTRE donnée.    │
           │                                                              │
           │ Résultat visible : le texte d'une tâche s'affiche avec la    │
           │ case cochée d'une autre. Essaie-le dans la branche           │
           │ `02-a-reviser`, c'est spectaculaire.                         │
           └──────────────────────────────────────────────────────────────┘ */
        <LigneTache
          key={tache.id}
          tache={tache}
          onBasculer={onBasculer}
          onSupprimer={onSupprimer}
          onRenommer={onRenommer}
        />
      ))}
    </ul>
  );
}

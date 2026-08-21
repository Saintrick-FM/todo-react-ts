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
      {taches.map((tache, index) => (
        <LigneTache
          key={index}
          tache={tache}
          onBasculer={onBasculer}
          onSupprimer={onSupprimer}
          onRenommer={onRenommer}
        />
      ))}
    </ul>
  );
}

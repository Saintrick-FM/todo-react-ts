import { LIBELLES_FILTRES, type Filtre } from "../types";

type Props = {
  actif: Filtre;
  onChanger: (filtre: Filtre) => void;
};

/** Toutes les valeurs possibles du type, écrites une seule fois. */
const TOUS_LES_FILTRES: Filtre[] = ["toutes", "a-faire", "faites"];

/**
 * Composant de PRÉSENTATION, sans aucun état.
 *
 * Il reçoit le filtre actif et une fonction pour le changer. C'est tout.
 * Point important : il ne reçoit PAS la liste des tâches et ne filtre rien
 * lui-même — filtrer est le travail du parent (voir lib/taches.ts).
 */
export default function Filtres({ actif, onChanger }: Props) {
  return (
    // role="group" + aria-label : un lecteur d'écran annonce
    // « groupe, Filtrer les tâches » avant d'énumérer les boutons.
    <div className="filtres" role="group" aria-label="Filtrer les tâches">
      {TOUS_LES_FILTRES.map((filtre) => (
        <button
          key={filtre}
          type="button"
          className="filtres__bouton"
          /* aria-pressed indique l'état ENFONCÉ du bouton aux technologies
             d'assistance. Le CSS s'appuie sur ce même attribut pour le style :
             l'apparence et l'information accessible ne peuvent donc jamais
             se contredire. Une classe "active" gérée à part, si. */
          aria-pressed={actif === filtre}
          onClick={() => onChanger(filtre)}
        >
          {LIBELLES_FILTRES[filtre]}
        </button>
      ))}
    </div>
  );
}

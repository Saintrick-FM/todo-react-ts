import { useRef, useState, type FormEvent } from "react";
import type { Tache } from "../types";

type Props = {
  tache: Tache;
  onBasculer: (id: string) => void;
  onSupprimer: (id: string) => void;
  onRenommer: (id: string, titre: string) => void;
};

/**
 * Une ligne de la liste.
 *
 * ┌─ LE POINT LE PLUS IMPORTANT DE CE FICHIER ────────────────────────────┐
 * │ Ce composant ne stocke PAS `tache.faite` dans un état local.          │
 * │                                                                       │
 * │ Écrire `const [faite, setFaite] = useState(tache.faite)` semble       │
 * │ pratique, mais crée deux copies de la même information : celle du     │
 * │ parent et celle-ci. Elles se désynchronisent au premier changement    │
 * │ venu — et le bug est très difficile à lire, parce que l'affichage     │
 * │ mélange alors deux sources.                                           │
 * │                                                                       │
 * │ Règle : une donnée a UN seul propriétaire. Ici, c'est le parent.      │
 * │ Ce composant ne fait que l'afficher et signaler les intentions.       │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * En revanche `enEdition` et `brouillon` sont bien des états locaux — et c'est
 * correct : ils décrivent l'affichage de CETTE ligne, pas la donnée. Personne
 * d'autre n'a besoin de savoir qu'on est en train d'éditer.
 */
export default function LigneTache({
  tache,
  onBasculer,
  onSupprimer,
  onRenommer,
}: Props) {
  const [enEdition, setEnEdition] = useState(false);
  const [brouillon, setBrouillon] = useState(tache.titre);
  const champRef = useRef<HTMLInputElement>(null);

  function ouvrirEdition() {
    setBrouillon(tache.titre);
    setEnEdition(true);
    // Le champ n'existe pas encore au moment de ce clic : React ne l'a pas
    // rendu. On attend donc le tour de boucle suivant pour lui donner le focus.
    setTimeout(() => champRef.current?.select(), 0);
  }

  function validerEdition(event: FormEvent) {
    event.preventDefault();
    const propre = brouillon.trim();
    // Titre vidé = on annule plutôt que de créer une tâche sans texte.
    if (propre.length > 0 && propre !== tache.titre) {
      onRenommer(tache.id, propre);
    }
    setEnEdition(false);
  }

  if (enEdition) {
    return (
      <li className="tache">
        <form className="tache" style={{ flex: 1, padding: 0, border: 0 }} onSubmit={validerEdition}>
          <input
            ref={champRef}
            className="tache__champ"
            value={brouillon}
            onChange={(e) => setBrouillon(e.target.value)}
            /* Échap annule l'édition : un raccourci que tout le monde essaie
               instinctivement, et dont l'absence est ressentie comme un bug. */
            onKeyDown={(e) => e.key === "Escape" && setEnEdition(false)}
            onBlur={validerEdition}
            aria-label={`Renommer « ${tache.titre} »`}
          />
          <button className="bouton" type="submit">
            OK
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="tache">
      {/* Case à cocher CONTRÔLÉE : `checked` vient des props, et `onChange`
          remonte l'intention. Sans `checked`, le navigateur gère la case dans
          son coin et l'affichage peut finir par contredire les données.

          `onChange` et non `onClick` : `onChange` se déclenche aussi à la barre
          d'espace, donc au clavier. */}
      <input
        id={`tache-${tache.id}`}
        className="tache__case"
        type="checkbox"
        checked={tache.faite}
        onChange={() => onBasculer(tache.id)}
      />

      {/* Un vrai <label> lié par htmlFor : cliquer le texte coche la case,
          et le lecteur d'écran annonce le libellé avec l'état de la case. */}
      <label
        className={`tache__libelle ${tache.faite ? "tache__libelle--faite" : ""}`}
        htmlFor={`tache-${tache.id}`}
      >
        {tache.titre}
      </label>

      <div className="tache__actions">
        {/* De vrais <button>, pas des <i onClick>. Un <i> n'est pas atteignable
            au clavier, n'a pas de rôle, et n'est jamais annoncé.
            aria-label donne un nom explicite à un bouton sans texte. */}
        <button
          type="button"
          className="tache__action"
          onClick={ouvrirEdition}
          aria-label={`Renommer « ${tache.titre} »`}
          title="Renommer"
        >
          ✎
        </button>
        <button
          type="button"
          className="tache__action tache__action--danger"
          onClick={() => onSupprimer(tache.id)}
          aria-label={`Supprimer « ${tache.titre} »`}
          title="Supprimer"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

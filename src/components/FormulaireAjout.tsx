import { useRef, useState, type FormEvent } from "react";

type Props = {
  /** Appelée quand l'utilisateur valide. Le parent décide quoi en faire. */
  onAjouter: (titre: string) => void;
};

/**
 * Composant de PRÉSENTATION.
 *
 * Il ne connaît pas les tâches, ne lit pas le stockage, ne sait rien du filtre.
 * Il fait une seule chose : récupérer une saisie et la remonter au parent via
 * `onAjouter`. C'est ce qui le rend réutilisable et testable isolément.
 *
 * Il possède quand même deux états locaux — et c'est légitime :
 * `titre` et `erreur` ne concernent QUE l'affichage de ce formulaire.
 * Un état local est un problème seulement quand il duplique une donnée qui
 * appartient à quelqu'un d'autre.
 */
export default function FormulaireAjout({ onAjouter }: Props) {
  const [titre, setTitre] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  /**
   * useRef donne accès au vrai élément du DOM.
   * Ici, uniquement pour rendre le focus au champ après l'ajout : sans ça,
   * un utilisateur au clavier doit re-naviguer jusqu'au champ à chaque tâche.
   *
   * `useRef<HTMLInputElement>(null)` : on type précisément l'élément.
   * `useRef<any>` ferait taire TypeScript, et supprimerait du même coup toute
   * l'aide qu'il pouvait apporter.
   */
  const champRef = useRef<HTMLInputElement>(null);

  /**
   * `onSubmit` sur le <form>, et non `onClick` sur le bouton.
   *
   * La différence est invisible à la souris, décisive au clavier : avec
   * `onSubmit`, la touche Entrée dans le champ valide le formulaire. Avec
   * `onClick`, Entrée déclenche l'envoi natif du navigateur — et la page se
   * recharge, effaçant tout.
   *
   * `event.preventDefault()` empêche justement cet envoi natif.
   */
  function gererEnvoi(event: FormEvent) {
    event.preventDefault();

    // On nettoie AVANT de valider : "   " ne doit pas passer pour du contenu.
    const propre = titre.trim();

    if (propre.length === 0) {
      setErreur("Écris quelque chose avant d'ajouter.");
      return;
    }

    onAjouter(propre);
    setTitre("");
    setErreur(null);
    champRef.current?.focus();
  }

  return (
    <>
      <form className="formulaire" onSubmit={gererEnvoi}>
        {/* Un champ de saisie a TOUJOURS un label associé. Ici il est masqué
            visuellement par le placeholder, donc on passe par aria-label :
            un lecteur d'écran annoncera quand même « Nouvelle tâche ». */}
        <input
          ref={champRef}
          className="formulaire__champ"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Acheter des patates…"
          aria-label="Nouvelle tâche"
          aria-invalid={erreur !== null}
        />
        <button className="bouton" type="submit">
          Ajouter
        </button>
      </form>

      {/* role="alert" : le message est annoncé dès son apparition, sans que
          l'utilisateur ait à le chercher. */}
      {erreur && (
        <p className="formulaire__erreur" role="alert">
          {erreur}
        </p>
      )}
    </>
  );
}

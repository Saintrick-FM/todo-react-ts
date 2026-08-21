type Props = {
  restantes: number;
  faites: number;
  onViderFaites: () => void;
};

/**
 * Le pied de liste : compteur et nettoyage.
 */
export default function Stats({ restantes, faites, onViderFaites }: Props) {
  return (
    <div className="stats">
      {/* aria-live="polite" : quand ce texte change, un lecteur d'écran
          l'annonce sans interrompre la lecture en cours. Sans ça, un
          utilisateur aveugle coche une tâche et ne reçoit aucune confirmation
          que le compteur a bougé.
          Coût : un attribut. Bénéfice : l'application devient utilisable. */}
      <p className="stats__compteur" aria-live="polite">
        {restantes === 0
          ? "Tout est fait."
          : `${restantes} tâche${restantes > 1 ? "s" : ""} restante${restantes > 1 ? "s" : ""}`}
      </p>

      {/* Le bouton n'apparaît que s'il a quelque chose à faire. */}
      {faites > 0 && (
        <button type="button" className="bouton bouton--discret" onClick={onViderFaites}>
          Effacer les {faites} terminée{faites > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

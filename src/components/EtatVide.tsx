type Props = {
  titre: string;
  texte: string;
};

/**
 * L'état vide.
 *
 * Il compte autant que le reste : une liste vide sans explication ressemble à
 * un bug. Les états vides, de chargement et d'erreur sont ce qui sépare une
 * démo d'un produit — et c'est la première chose que je regarde en revue.
 */
export default function EtatVide({ titre, texte }: Props) {
  return (
    <div className="vide">
      <p className="vide__titre">{titre}</p>
      <p className="vide__texte">{texte}</p>
    </div>
  );
}

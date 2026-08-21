import FormulaireAjout from "./components/FormulaireAjout";
import Filtres from "./components/Filtres";
import ListeTaches from "./components/ListeTaches";
import EtatVide from "./components/EtatVide";
import Stats from "./components/Stats";
import { useTaches } from "./hooks/useTaches";

/**
 * Le composant racine.
 *
 * Regarde sa taille : une soixantaine de lignes, dont l'essentiel est du JSX.
 * Il ne contient aucune règle métier, aucun appel au stockage, aucun calcul.
 * Il assemble, c'est tout.
 *
 * C'est le signe qu'un découpage fonctionne : le composant de plus haut niveau
 * se lit comme un plan de l'interface.
 */
export default function App() {
  const {
    taches,
    tachesVisibles,
    filtre,
    stats,
    setFiltre,
    ajouter,
    basculer,
    supprimer,
    renommer,
    viderFaites,
  } = useTaches();

  /* Deux situations vides à distinguer — c'est un détail d'expérience
     utilisateur qui fait la différence entre une démo et un produit :
       • aucune tâche du tout → on invite à en créer une ;
       • des tâches existent mais le filtre n'en laisse passer aucune →
         on explique que c'est le filtre, pas un bug. */
  const listeTotalementVide = taches.length === 0;
  const filtreSansResultat = !listeTotalementVide && tachesVisibles.length === 0;

  return (
    // <main> plutôt qu'un <div> : la structure sémantique permet aux lecteurs
    // d'écran de sauter directement au contenu principal.
    <main className="app">
      <h1 className="app__titre">Mes tâches</h1>
      <p className="app__sous-titre">
        Tout est enregistré dans ton navigateur. Recharge la page pour vérifier.
      </p>

      <FormulaireAjout onAjouter={ajouter} />

      <Filtres actif={filtre} onChanger={setFiltre} />

      {listeTotalementVide ? (
        <EtatVide
          titre="Aucune tâche pour l'instant"
          texte="Ajoute ta première tâche avec le champ ci-dessus."
        />
      ) : filtreSansResultat ? (
        <EtatVide
          titre="Rien à afficher avec ce filtre"
          texte="Change de filtre pour voir tes autres tâches."
        />
      ) : (
        <ListeTaches
          taches={tachesVisibles}
          onBasculer={basculer}
          onSupprimer={supprimer}
          onRenommer={renommer}
        />
      )}

      {!listeTotalementVide && (
        <Stats
          restantes={stats.restantes}
          faites={stats.faites}
          onViderFaites={viderFaites}
        />
      )}
    </main>
  );
}

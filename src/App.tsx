import { useMemo, useState } from "react";
import FormulaireAjout from "./components/FormulaireAjout";
import Filtres from "./components/Filtres";
import ListeTaches from "./components/ListeTaches";
import EtatVide from "./components/EtatVide";
import Stats from "./components/Stats";
import * as Taches from "./lib/taches";
import type { Filtre, Tache } from "./types";

/* ==========================================================================
   ÉTAPE 2 — LES VALEURS DÉRIVÉES

   C'est l'étape la plus importante de l'atelier.

   ┌─ LA RÈGLE ──────────────────────────────────────────────────────────┐
   │ Une valeur qui peut se DÉDUIRE d'autres valeurs ne doit pas vivre   │
   │ dans un état. On la recalcule pendant le rendu.                     │
   └─────────────────────────────────────────────────────────────────────┘

   Ici, deux états seulement : `taches` et `filtre`.
   Tout le reste — la liste affichée, le nombre de tâches restantes — se
   calcule à partir d'eux.

   ┌─ CE QU'IL NE FAUT SURTOUT PAS FAIRE ────────────────────────────────┐
   │   const [tachesVisibles, setTachesVisibles] = useState([]);         │
   │                                                                      │
   │   function changerFiltre(f) {                                        │
   │     setFiltre(f);                                                    │
   │     setTachesVisibles(taches.filter(...));   // ← le piège           │
   │   }                                                                  │
   │                                                                      │
   │ Ça semble marcher. Puis :                                            │
   │   1. on filtre sur « À faire » → `tachesVisibles` ne contient plus   │
   │      que les tâches non faites ;                                     │
   │   2. on ajoute une tâche à partir de cette liste amputée ;           │
   │   3. les tâches terminées ont disparu. Définitivement.               │
   │                                                                      │
   │ Deux sources de vérité finissent toujours par diverger. Va voir la   │
   │ branche `revue-de-code` : ce bug exact y est reproduit.              │
   └──────────────────────────────────────────────────────────────────────┘
   ========================================================================== */

export default function App() {
  // Les deux SEULS états de l'application.
  const [taches, setTaches] = useState<Tache[]>([]);
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  /* Valeurs DÉRIVÉES : recalculées à chaque rendu, jamais stockées.
     Elles ne peuvent pas se désynchroniser, puisqu'elles n'existent
     jamais indépendamment de `taches` et `filtre`.

     À propos de useMemo : sur trente tâches, il n'apporte rien de mesurable.
     Il est ici pour que tu saches l'écrire. La règle reste : on n'optimise
     pas ce qu'on n'a pas mesuré. */
  const tachesVisibles = useMemo(
    () => Taches.trier(Taches.filtrer(taches, filtre)),
    [taches, filtre]
  );

  const stats = useMemo(() => Taches.compter(taches), [taches]);

  /* Deux situations vides différentes — c'est ce genre de détail qui sépare
     une démo d'un produit : une liste vide sans explication ressemble à un bug. */
  const listeTotalementVide = taches.length === 0;
  const filtreSansResultat = !listeTotalementVide && tachesVisibles.length === 0;

  return (
    <main className="app">
      <h1 className="app__titre">Mes tâches</h1>
      <p className="app__sous-titre">
        Étape 2 : les filtres fonctionnent. Rien n'est encore enregistré.
      </p>

      <FormulaireAjout
        onAjouter={(titre) => setTaches((p) => Taches.ajouter(p, titre))}
      />

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
          onBasculer={(id) => setTaches((p) => Taches.basculer(p, id))}
          onSupprimer={(id) => setTaches((p) => Taches.supprimer(p, id))}
          onRenommer={(id, titre) => setTaches((p) => Taches.renommer(p, id, titre))}
        />
      )}

      {!listeTotalementVide && (
        <Stats
          restantes={stats.restantes}
          faites={stats.faites}
          onViderFaites={() => setTaches((p) => Taches.viderFaites(p))}
        />
      )}
    </main>
  );
}

import { useState } from "react";
import FormulaireAjout from "./components/FormulaireAjout";
import Filtres from "./components/Filtres";
import ListeTaches from "./components/ListeTaches";
import EtatVide from "./components/EtatVide";
import * as Taches from "./lib/taches";
import type { Filtre, Tache } from "./types";

/* ==========================================================================
   ÉTAPE 1 — L'ÉTAT ET LES LISTES

   L'application vit : on peut ajouter, cocher, renommer et supprimer.
   Rien n'est encore filtré ni enregistré — ce sont les étapes 2 et 3.

   Ce qu'il faut retenir de cette étape :

   1. UNE SEULE SOURCE DE VÉRITÉ
      `taches` est la donnée. Tout le reste s'affiche à partir d'elle.

   2. LES ACTIONS NE CONTIENNENT PAS DE RÈGLES
      Chaque gestionnaire délègue à lib/taches.ts et range le résultat.
      La règle est écrite une fois, testée une fois.

   3. LA FORME FONCTION DU SETTER
      `setTaches(precedentes => ...)` plutôt que `setTaches(f(taches))`.
      On part ainsi toujours de la valeur la plus récente, même si plusieurs
      mises à jour s'enchaînent dans le même cycle. Prends le réflexe tout de
      suite : la différence est invisible ici, décisive plus tard.
   ========================================================================== */

export default function App() {
  const [taches, setTaches] = useState<Tache[]>([]);

  // Le filtre existe déjà dans l'état, mais il ne filtre encore rien.
  // On le branchera à l'étape 2 — c'est le cœur de la prochaine leçon.
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  return (
    <main className="app">
      <h1 className="app__titre">Mes tâches</h1>
      <p className="app__sous-titre">
        Étape 1 : la liste fonctionne. Elle n'est pas encore enregistrée —
        recharge la page et tout disparaît.
      </p>

      <FormulaireAjout
        onAjouter={(titre) => setTaches((p) => Taches.ajouter(p, titre))}
      />

      <Filtres actif={filtre} onChanger={setFiltre} />

      {taches.length === 0 ? (
        <EtatVide
          titre="Aucune tâche pour l'instant"
          texte="Ajoute ta première tâche avec le champ ci-dessus."
        />
      ) : (
        <ListeTaches
          taches={taches}
          onBasculer={(id) => setTaches((p) => Taches.basculer(p, id))}
          onSupprimer={(id) => setTaches((p) => Taches.supprimer(p, id))}
          /* renommer arrive à l'étape 2 : la fonction n'est pas encore écrite. */
          onRenommer={() => {}}
        />
      )}
    </main>
  );
}

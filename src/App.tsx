import { useState } from "react";
import FormulaireAjout from "./components/FormulaireAjout";
import Filtres from "./components/Filtres";
import ListeTaches from "./components/ListeTaches";
import EtatVide from "./components/EtatVide";
import Stats from "./components/Stats";
import type { Filtre, Tache } from "./types";

/* ==========================================================================
   POINT DE DÉPART.

   L'interface est terminée et ne demande aucun travail : les composants de
   src/components/ sont écrits, la feuille de style aussi. Ils attendent
   simplement qu'on leur passe des données et des fonctions.

   Ton travail est ailleurs — dans la LOGIQUE :
     src/lib/taches.ts        les règles      (étapes 1 et 2)
     src/hooks/useStockageLocal.ts  la persistance  (étape 3)
     src/hooks/useTaches.ts   l'état de l'app  (étape 4)
     src/App.tsx              ce fichier, à brancher au fur et à mesure

   Les données ci-dessous sont FIGÉES, juste pour que tu voies l'interface
   telle qu'elle doit fonctionner. Rien ne réagit encore.

   Vérifie ta progression avec :   npm run test:watch
   ========================================================================== */

const DONNEES_DEMO: Tache[] = [
  {
    id: "demo-1",
    titre: "Remplacer ces données figées par un vrai état",
    faite: false,
    creeeLe: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "demo-2",
    titre: "Implémenter les fonctions de src/lib/taches.ts",
    faite: false,
    creeeLe: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "demo-3",
    titre: "Lire les commentaires — ils expliquent chaque piège",
    faite: true,
    creeeLe: "2026-01-01T08:00:00.000Z",
  },
];

export default function App() {
  /* Étape 1 : remplace DONNEES_DEMO par un vrai état, et branche les actions
     sur les fonctions de lib/taches.ts.
     Étape 4 : tout ceci disparaîtra au profit d'une seule ligne —
     const { ... } = useTaches(); */
  const [taches] = useState<Tache[]>(DONNEES_DEMO);
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  return (
    <main className="app">
      <h1 className="app__titre">Mes tâches</h1>
      <p className="app__sous-titre">
        Tout est enregistré dans ton navigateur. Recharge la page pour vérifier.
      </p>

      <div className="aide">
        <p className="aide__titre">Point de départ de l'atelier</p>
        <p>
          L'interface est prête. Les données affichées sont figées et rien ne
          réagit encore. Ouvre <code>src/lib/taches.ts</code> et lance{" "}
          <code>npm run test:watch</code> : les tests décrivent exactement ce que
          tu dois écrire. Supprime ce bandeau quand l'application vit.
        </p>
      </div>

      {/* onAjouter attend une fonction (titre: string) => void.
          Pour l'instant on lui en passe une qui ne fait rien. */}
      <FormulaireAjout onAjouter={() => {}} />

      <Filtres actif={filtre} onChanger={setFiltre} />

      {taches.length === 0 ? (
        <EtatVide
          titre="Aucune tâche pour l'instant"
          texte="Ajoute ta première tâche avec le champ ci-dessus."
        />
      ) : (
        <ListeTaches
          taches={taches}
          onBasculer={() => {}}
          onSupprimer={() => {}}
          onRenommer={() => {}}
        />
      )}

      <Stats restantes={2} faites={1} onViderFaites={() => {}} />
    </main>
  );
}

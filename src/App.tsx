import { useMemo } from "react";
import { useStockageLocal } from "./hooks/useStockageLocal";
import FormulaireAjout from "./components/FormulaireAjout";
import Filtres from "./components/Filtres";
import ListeTaches from "./components/ListeTaches";
import EtatVide from "./components/EtatVide";
import Stats from "./components/Stats";
import * as Taches from "./lib/taches";
import type { Filtre, Tache } from "./types";

/* ==========================================================================
   ÉTAPE 3 — LA PERSISTANCE

   Les tâches survivent maintenant au rechargement de la page.

   Un seul changement par rapport à l'étape 2 : `useState` devient
   `useStockageLocal`. Toute la mécanique — lecture initiale, écriture,
   validation, gestion des erreurs — est enfermée dans ce hook.

   ┌─ CE QUE FAIT LE HOOK, ET POURQUOI ──────────────────────────────────┐
   │                                                                      │
   │ 1. INITIALISATION PARESSEUSE                                         │
   │      useState(lire(...))        ← relit le stockage à CHAQUE rendu   │
   │      useState(() => lire(...))  ← lit une seule fois, au montage     │
   │                                                                      │
   │    Dans le premier cas React ignore la valeur après le premier       │
   │    rendu, mais l'expression est quand même évaluée : lecture du      │
   │    stockage + JSON.parse à chaque frappe au clavier.                 │
   │                                                                      │
   │ 2. UN useEffect POUR SYNCHRONISER                                    │
   │    Un effet sert à mettre React en accord avec quelque chose         │
   │    d'EXTÉRIEUR : ici le stockage du navigateur. C'est son rôle.      │
   │                                                                      │
   │    Il ne sert PAS à calculer une valeur dérivée de l'état — pour ça  │
   │    on calcule pendant le rendu, comme `tachesVisibles` ci-dessous.   │
   │    Lis « Vous n'avez peut-être pas besoin d'un Effet » sur react.dev.│
   │                                                                      │
   │ 3. LA VALIDATION À LA RELECTURE                                      │
   │    On ne fait jamais confiance à ce qu'on relit : le contenu peut    │
   │    être corrompu, ou écrit par une version précédente de l'appli.    │
   │    Même principe qu'en semaine 4 avec Zod, côté serveur.             │
   └──────────────────────────────────────────────────────────────────────┘

   Remarque : `taches` et `filtre` sont persistés séparément. Le filtre est une
   préférence d'affichage, les tâches sont des données. Deux natures, deux clés.

   ========================================================================== */

/* Les « gardes de type » : elles vérifient que ce qu'on relit du stockage a
   bien la forme attendue. La signature `v is Tache[]` est un prédicat de type —
   si la fonction renvoie true, TypeScript traite `v` comme un `Tache[]`.

   À l'étape 4, ces deux fonctions déménageront dans le hook métier : elles
   n'ont rien à faire dans un composant d'affichage. */
function estTableauDeTaches(v: unknown): v is Tache[] {
  return (
    Array.isArray(v) &&
    v.every(
      (t) =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as Tache).id === "string" &&
        typeof (t as Tache).titre === "string" &&
        typeof (t as Tache).faite === "boolean"
    )
  );
}

function estFiltre(v: unknown): v is Filtre {
  return v === "toutes" || v === "a-faire" || v === "faites";
}

export default function App() {
  // Les deux SEULS états — désormais persistés.
  const [taches, setTaches] = useStockageLocal<Tache[]>(
    "atelier.taches",
    [],
    estTableauDeTaches
  );
  const [filtre, setFiltre] = useStockageLocal<Filtre>(
    "atelier.filtre",
    "toutes",
    estFiltre
  );

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
        Étape 3 : tout est enregistré dans ton navigateur. Recharge la page.
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

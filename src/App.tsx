import { useEffect, useState } from "react";
import FormulaireAjout from "./components/FormulaireAjout";
import Filtres from "./components/Filtres";
import ListeTaches from "./components/ListeTaches";
import Stats from "./components/Stats";
import type { Filtre, Tache } from "./types";

const CLE = "atelier.taches";

function App() {
  const [taches, setTaches] = useState<Tache[]>(
    JSON.parse(localStorage.getItem(CLE) || "[]")
  );
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  useEffect(() => {
    localStorage.setItem(CLE, JSON.stringify(taches));
  });

  const ajouterTache = (titre: string) => {
    const nouvelle: Tache = {
      id: String(taches.length + 1),
      titre: titre,
      faite: false,
      creeeLe: new Date().toISOString(),
    };
    taches.push(nouvelle);
    setTaches(taches);
    localStorage.setItem(CLE, JSON.stringify(taches));
  };

  const changerFiltre = (nouveauFiltre: Filtre) => {
    const toutes = JSON.parse(localStorage.getItem(CLE) || "[]") as Tache[];
    setFiltre(nouveauFiltre);
    if (nouveauFiltre === "a-faire") {
      const resultat = toutes.filter((t) => t.faite === false);
      console.log("filtre a-faire", resultat);
      setTaches(resultat);
    }
    if (nouveauFiltre === "faites") {
      const resultat = toutes.filter((t) => t.faite === true);
      console.log("filtre faites", resultat);
      setTaches(resultat);
    }
    if (nouveauFiltre === "toutes") {
      setTaches(toutes);
    }
  };

  const basculerTache = (id: string) => {
    const toutes = JSON.parse(localStorage.getItem(CLE) || "[]") as Tache[];
    const nouvelles = toutes.map((t) => {
      if (t.id === id) {
        t.faite = !t.faite;
      }
      return t;
    });
    localStorage.setItem(CLE, JSON.stringify(nouvelles));
    setTaches(nouvelles);
  };

  const supprimerTache = (id: string) => {
    const toutes = JSON.parse(localStorage.getItem(CLE) || "[]") as Tache[];
    const nouvelles = toutes.filter((t) => t.id !== id);
    console.log("apres suppression", JSON.stringify(nouvelles));
    localStorage.setItem(CLE, JSON.stringify(nouvelles));
    setTaches(nouvelles);
  };

  const renommerTache = (id: string, titre: string) => {
    const nouvelles = taches.map((t) => (t.id === id ? { ...t, titre: titre } : t));
    setTaches(nouvelles);
  };

  const viderFaites = () => {
    const nouvelles = taches.filter((t) => t.faite !== true);
    setTaches(nouvelles);
  };

  const nbFaites = taches.filter((t) => t.faite === true).length;
  const nbRestantes = taches.filter((t) => t.faite === false).length;

  return (
    <main className="app">
      <h1 className="app__titre">Mes tâches</h1>
      <p className="app__sous-titre">
        Tout est enregistré dans ton navigateur. Recharge la page pour vérifier.
      </p>

      <FormulaireAjout onAjouter={ajouterTache} />
      <Filtres actif={filtre} onChanger={changerFiltre} />

      <ListeTaches
        taches={taches}
        onBasculer={basculerTache}
        onSupprimer={supprimerTache}
        onRenommer={renommerTache}
      />

      <Stats restantes={nbRestantes} faites={nbFaites} onViderFaites={viderFaites} />
    </main>
  );
}

export default App;

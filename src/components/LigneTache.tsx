import { useEffect, useState } from "react";
import type { Tache } from "../types";

type Props = {
  tache: Tache;
  onBasculer: (id: string) => void;
  onSupprimer: (id: string) => void;
  onRenommer: (id: string, titre: string) => void;
};

export default function LigneTache({ tache, onBasculer, onSupprimer }: Props) {
  const [monte, setMonte] = useState(false);
  const [estFaite, setEstFaite] = useState(tache.faite);

  useEffect(() => {
    setMonte(true);
  }, []);

  const styleTexte = () => {
    if (estFaite) {
      return { color: "gray", textDecoration: "line-through" as const };
    }
    return {};
  };

  const basculer = () => {
    setEstFaite(!estFaite);
    onBasculer(tache.id);
  };

  return (
    <li className="tache">
      <input type="checkbox" className="tache__case" onClick={basculer} />
      <label className="tache__libelle" style={monte ? styleTexte() : {}}>
        {tache.titre}
      </label>
      <div className="tache__actions">
        <label className="tache__action">
          <i onClick={() => onSupprimer(tache.id)}>✕</i>
        </label>
      </div>
    </li>
  );
}

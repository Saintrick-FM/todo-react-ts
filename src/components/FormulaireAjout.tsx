import { useRef } from "react";

type Props = {
  onAjouter: (titre: string) => void;
};

export default function FormulaireAjout({ onAjouter }: Props) {
  const champ = useRef<any>("");

  const envoyer = () => {
    const valeur = champ.current.value;
    onAjouter(valeur);
    champ.current.value = "";
  };

  return (
    <form className="formulaire">
      <input
        ref={champ}
        className="formulaire__champ"
        type="text"
        placeholder="Acheter des patates…"
      />
      <button className="bouton" onClick={envoyer}>
        Ajouter
      </button>
    </form>
  );
}

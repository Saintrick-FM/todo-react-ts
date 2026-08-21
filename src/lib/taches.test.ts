import { describe, expect, it } from "vitest";
import {
  ajouter,
  basculer,
  compter,
  creerTache,
  filtrer,
  renommer,
  supprimer,
  trier,
  viderFaites,
} from "./taches";
import type { Tache } from "../types";

/* ==========================================================================
   Les tests de la logique métier.

   Remarque l'essentiel : pas de navigateur, pas de composant monté, pas de
   simulation de clic. On appelle des fonctions et on vérifie ce qu'elles
   renvoient. C'est court, rapide, et ça ne casse pas quand le design change.

   C'est le bénéfice direct d'avoir sorti les règles des composants. Si toute
   cette logique vivait dans App.tsx, tester « ajouter une tâche pendant qu'un
   filtre est actif » demanderait de monter l'application entière.

   Lancer : npm test
   ========================================================================== */

/** Petite fabrique pour écrire des tests lisibles. */
function tache(partiel: Partial<Tache> = {}): Tache {
  return {
    id: crypto.randomUUID(),
    titre: "Une tâche",
    faite: false,
    creeeLe: "2026-01-01T00:00:00.000Z",
    ...partiel,
  };
}

describe("creerTache", () => {
  it("nettoie les espaces autour du titre", () => {
    expect(creerTache("   du pain   ").titre).toBe("du pain");
  });

  it("génère des identifiants différents à chaque appel", () => {
    expect(creerTache("a").id).not.toBe(creerTache("a").id);
  });

  it("crée une tâche non faite", () => {
    expect(creerTache("a").faite).toBe(false);
  });
});

describe("ajouter", () => {
  it("ajoute la tâche à la fin", () => {
    const depart = [tache({ titre: "première" })];
    const resultat = ajouter(depart, "seconde");

    expect(resultat).toHaveLength(2);
    expect(resultat[1].titre).toBe("seconde");
  });

  // LE test qui documente l'immutabilité. S'il échoue, quelqu'un a réintroduit
  // un `push` — et l'interface a cessé de se rafraîchir.
  it("ne modifie pas le tableau d'origine", () => {
    const depart = [tache()];
    ajouter(depart, "nouvelle");

    expect(depart).toHaveLength(1);
  });
});

describe("basculer", () => {
  it("inverse uniquement la tâche visée", () => {
    const a = tache({ id: "a", faite: false });
    const b = tache({ id: "b", faite: false });
    const resultat = basculer([a, b], "a");

    expect(resultat[0].faite).toBe(true);
    expect(resultat[1].faite).toBe(false);
  });

  it("laisse les objets non concernés inchangés", () => {
    const a = tache({ id: "a" });
    const b = tache({ id: "b" });

    // Même référence : React pourra sauter le rendu de cette ligne.
    expect(basculer([a, b], "a")[1]).toBe(b);
  });
});

describe("supprimer", () => {
  it("retire la bonne tâche", () => {
    const resultat = supprimer([tache({ id: "a" }), tache({ id: "b" })], "a");

    expect(resultat).toHaveLength(1);
    expect(resultat[0].id).toBe("b");
  });
});

describe("renommer", () => {
  it("change le titre", () => {
    expect(renommer([tache({ id: "a" })], "a", "nouveau")[0].titre).toBe("nouveau");
  });

  it("ignore un titre vide plutôt que de l'enregistrer", () => {
    const depart = [tache({ id: "a", titre: "original" })];

    expect(renommer(depart, "a", "   ")[0].titre).toBe("original");
  });
});

describe("filtrer", () => {
  const liste = [
    tache({ id: "a", faite: false }),
    tache({ id: "b", faite: true }),
    tache({ id: "c", faite: false }),
  ];

  it("« toutes » renvoie tout", () => {
    expect(filtrer(liste, "toutes")).toHaveLength(3);
  });

  it("« a-faire » ne garde que les tâches non faites", () => {
    expect(filtrer(liste, "a-faire").every((t) => !t.faite)).toBe(true);
  });

  it("« faites » ne garde que les tâches faites", () => {
    expect(filtrer(liste, "faites")).toHaveLength(1);
  });

  // Le test le plus important du fichier : il verrouille le bug de perte de
  // données. Filtrer ne doit jamais toucher à la liste source.
  it("ne modifie jamais la liste d'origine", () => {
    filtrer(liste, "faites");

    expect(liste).toHaveLength(3);
  });
});

describe("compter", () => {
  it("compte faites et restantes", () => {
    const resultat = compter([
      tache({ faite: true }),
      tache({ faite: false }),
      tache({ faite: false }),
    ]);

    expect(resultat).toEqual({ total: 3, faites: 1, restantes: 2 });
  });

  it("gère la liste vide", () => {
    expect(compter([])).toEqual({ total: 0, faites: 0, restantes: 0 });
  });
});

describe("viderFaites", () => {
  it("ne garde que les tâches non faites", () => {
    const resultat = viderFaites([tache({ faite: true }), tache({ faite: false })]);

    expect(resultat).toHaveLength(1);
  });
});

describe("trier", () => {
  it("place les tâches à faire avant les tâches faites", () => {
    const resultat = trier([tache({ id: "faite", faite: true }), tache({ id: "todo", faite: false })]);

    expect(resultat[0].id).toBe("todo");
  });

  it("ne modifie pas le tableau d'origine (sort mute sur place)", () => {
    const liste = [tache({ id: "faite", faite: true }), tache({ id: "todo", faite: false })];
    trier(liste);

    expect(liste[0].id).toBe("faite");
  });
});

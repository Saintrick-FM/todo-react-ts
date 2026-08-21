# Correction de l'exercice de revue de code

À ouvrir **après** avoir rempli `MES-TROUVAILLES.md` sur la branche
`revue-de-code`.

13 problèmes, du plus grave au plus anodin.

---

## 1. Perte de données — `App.tsx`, `changerFiltre`

`setTaches(resultat)` écrase l'état avec la liste **filtrée**. Ajouter une tâche
ensuite écrit cette liste amputée dans le stockage : les tâches terminées
disparaissent définitivement.

**Cause** : deux sources de vérité pour la même information.
**Correction** : `taches` reste complet, la liste visible est *calculée*.

---

## 2. `push` — `App.tsx`, `ajouterTache`

`taches.push(nouvelle)` puis `setTaches(taches)` : même référence, React en
conclut que rien n'a changé. La donnée est modifiée, l'écran non.

**Correction** : `setTaches(p => [...p, nouvelle])`.

---

## 3. `key={index}` — `ListeTaches.tsx`

Combiné au problème 4, produit l'effet le plus déroutant du lot : après une
suppression, le texte d'une tâche s'affiche avec le style barré d'une autre.

**Correction** : `key={tache.id}`.

---

## 4. État local dupliquant les props — `LigneTache.tsx`

`useState(tache.faite)` crée une copie qui ne se resynchronise jamais. Avec
`key={index}`, React réutilise le composant pour une autre donnée — et l'ancien
état reste.

**Correction** : lire `tache.faite` directement. Une donnée a un seul
propriétaire.

---

## 5. Identifiants en collision — `App.tsx`

`String(taches.length + 1)` : supprime la tâche du milieu, ajoute-en une, et
l'identifiant existe déjà. Cocher l'une coche l'autre.

**Correction** : `crypto.randomUUID()`.

---

## 6. `useEffect` sans dépendances — `App.tsx`

`useEffect(() => { ... })` sans second argument s'exécute après **chaque** rendu.
Écriture dans le stockage à chaque frappe au clavier.

**Correction** : `[taches]`.

---

## 7. Lecture non paresseuse — `App.tsx`

`useState(JSON.parse(localStorage.getItem(...)))` évalue l'expression à chaque
rendu, même si React l'ignore ensuite.

**Correction** : `useState(() => ...)`.

---

## 8. Mutation dans `map` — `App.tsx`, `basculerTache`

`t.faite = !t.faite` modifie l'objet d'origine à l'intérieur du `map`. Le
tableau est neuf, les objets non.

**Correction** : `t.id === id ? { ...t, faite: !t.faite } : t`.

---

## 9. Le formulaire ne gère pas Entrée — `FormulaireAjout.tsx`

`onClick` sur le bouton au lieu de `onSubmit` sur le `<form>`. Taper du texte et
appuyer sur Entrée déclenche l'envoi natif : **la page se recharge**.

**Correction** : `onSubmit` + `event.preventDefault()`.

---

## 10. Case à cocher non contrôlée — `LigneTache.tsx`

Pas d'attribut `checked` : le navigateur gère l'affichage de son côté, qui peut
finir par contredire les données. Et `onClick` au lieu de `onChange` casse la
validation à la barre d'espace, donc au clavier.

**Correction** : `checked={tache.faite}` + `onChange`.

---

## 11. Bouton inaccessible — `LigneTache.tsx`

`<i onClick={...}>` : pas atteignable au clavier, aucun rôle, jamais annoncé par
un lecteur d'écran. La suppression est impossible sans souris.

**Correction** : un vrai `<button type="button" aria-label="…">`.

---

## 12. `useRef<any>` — `FormulaireAjout.tsx`

`any` fait taire TypeScript et supprime toute l'aide qu'il pouvait apporter.
Le titre n'est pas nettoyé non plus : `"   "` passe pour du contenu.

**Correction** : `useRef<HTMLInputElement>(null)`, et `.trim()`.

---

## 13. Détails

`console.log` oubliés en production · le stockage relu dans chaque gestionnaire
au lieu d'utiliser l'état · le bandeau `monte` + `useEffect` qui contourne un
problème inexistant, au prix d'un rendu supplémentaire.

---

## Ce qu'il faut retenir

Les problèmes 1, 2, 4 et 8 sont **le même problème** vu sous quatre angles :
une donnée modifiée là où elle n'aurait pas dû l'être, ou dupliquée là où elle
aurait dû rester unique.

C'est la leçon de la semaine. Elle vaut pour React, et elle vaudra pour la base
de données en semaine 5.

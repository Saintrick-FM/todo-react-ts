# Exercice de revue de code

Branche `revue-de-code` — **du code volontairement défectueux.**

Cette application a l'air de marcher. Elle ne marche pas.

## Ta mission

Lance-la, utilise-la comme un vrai utilisateur, et **trouve au moins 8 problèmes.**
Pour chacun : où il est, ce qu'il provoque, et pourquoi.

```bash
npm install
npm run dev
```

Note tes trouvailles dans `MES-TROUVAILLES.md` **avant** de regarder la
correction. Chercher sans filet est l'exercice ; lire la réponse ne t'apprendra
rien.

## Deux scénarios à jouer précisément

Ils déclenchent chacun un bug sérieux. Observe ce qui se passe, puis explique-le.

**Scénario A**
1. Ajoute quatre tâches.
2. Coche la deuxième.
3. Clique sur le filtre **« À faire »**.
4. Ajoute une nouvelle tâche.
5. Reviens sur **« Toutes »**. Recharge la page.

→ Où est passée la tâche cochée ?

**Scénario B**
1. Ajoute trois tâches : « une », « deux », « trois ».
2. Coche « deux ».
3. Supprime « une ».

→ Regarde le texte barré. Il ne correspond plus à la bonne tâche.

## Les pistes, si tu bloques

Sans donner les réponses, voici où regarder :

- Que fait exactement `taches.push(...)` suivi de `setTaches(taches)` ?
- D'où vient la liste affichée après avoir cliqué sur un filtre ?
- Quel identifiant reçoit une tâche créée après une suppression ?
- Que se passe-t-il si tu tapes du texte et appuies sur **Entrée** ?
- Essaie de cocher une case au clavier, avec Tab puis Espace.
- Essaie de supprimer une tâche au clavier.
- Ouvre la console du navigateur.
- Combien de fois le `useEffect` de `App.tsx` s'exécute-t-il ?
- `LigneTache` stocke `estFaite` dans un état local. À qui appartient vraiment
  cette information ?

## Après

Compare avec la branche `solution`, puis relis tes notes. Les écarts sont le
véritable cours.

```bash
git diff revue-de-code solution -- src/
```

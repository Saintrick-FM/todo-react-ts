import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

/**
 * Point d'entrée de l'application.
 *
 * <StrictMode> n'existe qu'en développement. Il monte volontairement chaque
 * composant DEUX fois pour révéler les effets mal écrits (ceux qui ne sont pas
 * idempotents, ou qui oublient leur fonction de nettoyage). Si ton code ne
 * fonctionne QUE parce que l'effet ne s'exécute qu'une fois, StrictMode te le
 * dira ici plutôt qu'en production.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n.jsx";
import { captureAttribution } from "./attribution.js";

// לוכד את נתוני הקמפיין מה-URL מיד עם הכניסה (לפני שהמשתמש מנווט)
captureAttribution();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);

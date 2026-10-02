import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Build-time prerendered head tags are for crawlers without JS; Helmet owns the head once the app runs.
document.head.querySelectorAll("[data-prerender]").forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(<App />);

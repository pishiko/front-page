import React from "react";
import ReactDOM from "react-dom/client";
import SiteApp from "../SiteApp";
import FontLoader from "../FontLoader";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FontLoader>{ready => <SiteApp initialView="lab" ready={ready} />}</FontLoader>
  </React.StrictMode>
);

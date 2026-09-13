import { useEffect, useState } from "react";
import App, { AppStartMode } from "./App";
import LabApp from "./lab/LabApp";
import "./SiteApp.css";

interface SiteAppProps {
  initialView?: "top" | "lab";
  ready?: boolean;
}

type ViewType = "top" | "lab";

export default function SiteApp({ initialView, ready = true }: SiteAppProps) {
  const getInitialView = (): ViewType => {
    if (initialView) return initialView;
    if (typeof window !== "undefined") {
      const normalized = window.location.pathname.replace(/\/$/, "");
      return normalized.endsWith("/lab") ? "lab" : "top";
    }
    return "top";
  };

  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [hasOpenedTop, setHasOpenedTop] = useState(() => currentView === "top");
  const [topAnimationDone, setTopAnimationDone] = useState(false);

  useEffect(() => {
    if (currentView === "top") setHasOpenedTop(true);
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      const normalized = window.location.pathname.replace(/\/$/, "");
      setCurrentView(normalized.endsWith("/lab") ? "lab" : "top");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToLab = () => {
    setCurrentView("lab");
    if (window.location.pathname !== "/lab/") {
      window.history.pushState(null, "", "/lab/");
    }
  };

  const navigateToTop = () => {
    setCurrentView("top");
    if (window.location.pathname !== "/") {
      window.history.pushState(null, "", "/");
    }
  };

  const isLab = currentView === "lab";

  // Once started, keep the same animation mounted even during a trip to Lab.
  const appStartMode: AppStartMode = topAnimationDone
    ? "content"
    : hasOpenedTop || currentView === "top" ? "normal" : "wait";

  const handleTopAnimationDone = () => {
    setTopAnimationDone(true);
  };

  return (
    <div className="site-container">
      {/* 
        Top Page Slide (left side)
        Slides to the left (-100%) when moving to Lab.
        Slides back from the left (0) when returning to Top.
      */}
      <div
        className={`top-view-wrapper ${isLab ? "on-lab" : ""}`}
        data-testid="top-view-wrapper"
      >
        <App
          onNavigateToLab={navigateToLab}
          startMode={ready ? appStartMode : "wait"}
          onAnimationDone={handleTopAnimationDone}
        />
      </div>

      {/* 
        Lab Page Slide (right side)
        Slides in from the right (0) when moving to Lab.
        Slides back to the right (+100%) when returning to Top.
      */}
      <div
        className={`lab-view-wrapper ${isLab ? "on-lab" : ""}`}
        data-testid="lab-view-wrapper"
      >
        <LabApp
          active={ready && isLab}
          onNavigateToTop={navigateToTop}
        />
      </div>
    </div>
  );
}

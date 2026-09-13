import { MouseEventHandler, useEffect, useId, useState } from "react";
import "./App.css";

interface SocialLink {
  label: string;
  href: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "Twitter (@pishitaro_)", href: "https://twitter.com/pishitaro_" },
  { label: "GitHub (github.com/pishiko)", href: "https://github.com/pishiko" },
  { label: "TechBlog (blog.p4ko.com)", href: "https://blog.p4ko.com" },
  { label: "Note (note.com/p4k)", href: "https://note.com/p4k" },
  { label: "しずかなインターネット (sizu.me/p4k)", href: "https://sizu.me/p4k" },
];

export type AppStartMode = "normal" | "content" | "wait";

interface AppProps {
  onNavigateToLab?: () => void;
  startMode?: AppStartMode;
  onAnimationDone?: () => void;
}

function App({ onNavigateToLab, startMode = "normal", onAnimationDone }: AppProps) {
  const leafFilterId = useId();
  const [phase, setPhase] = useState<"whole" | "exploding" | "exploded">("whole");
  const [mousePosRate, setMousePosRate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (startMode === "content") {
      setPhase("exploded");
      return;
    }

    setPhase("whole");
    if (startMode === "wait") return;

    const timer = setTimeout(() => {
      setPhase("exploding");
    }, 4700);
    return () => clearTimeout(timer);
  }, [startMode]);

  const onMouseMove: MouseEventHandler = (event) => {
    if (phase !== "exploded") return;
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    setMousePosRate({ x, y });
  };

  return (
    <div
      className={`App ${phase === "exploded" || startMode === "content" ? "background-revealed" : ""}`}
      onMouseMove={onMouseMove}
    >
      <svg width="0" height="0" className="tomato-filters" aria-hidden="true">
        <defs>
          <filter id={leafFilterId} colorInterpolationFilters="sRGB">
            {/* Select green pixels, leaving every red sprite frame unchanged. */}
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 4 0 0 0" result="leaves" />
            <feFlood floodColor="#12836d" />
            <feComposite in2="leaves" operator="in" />
            <feComposite in2="SourceGraphic" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>
      <div className="tomato-stage" aria-hidden="true">
        <div className={`tomato-entrance ${startMode === "normal" ? "tomato-arriving" : ""}`}>
          <div
            className={`tomato tomato-${startMode === "content" ? "exploded" : phase}`}
            style={{
              translate: `${-mousePosRate.x * 8}px ${-mousePosRate.y * 8}px`,
              filter: `url(#${leafFilterId})`,
            }}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget || phase !== "exploding") return;
              setPhase("exploded");
              onAnimationDone?.();
            }}
          />
        </div>
      </div>

      <div className="content">
        <h1>p4ko.com</h1>
        {SOCIAL_LINKS.map((link) => (
          <div key={link.href}>
            <a target="_blank" href={link.href} rel="noreferrer">
              {link.label}
            </a>
          </div>
        ))}

        <a
          href="/lab/"
          className="lab-nav-button"
          aria-label="Go to Lab"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault();
              if (onNavigateToLab) {
                onNavigateToLab();
              } else {
                window.history.pushState(null, "", "/lab/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }
            }
          }}
        >
          <span>Lab</span> →
        </a>
      </div>
    </div>
  );
}

export default App;

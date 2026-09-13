import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./App.css";
import { CSSTransition } from "react-transition-group";

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

function App() {
  const [titleActive, setTitleActive] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const [mousePosRate, setMousePosRate] = useState({ x: 0, y: 0 });

  const titlesRef = useRef<HTMLDivElement>(null);
  const tomatoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const curtainTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseMove: MouseEventHandler = (event) => {
    if (!animationDone) return;
    const xr = (event.clientX / window.innerWidth - 0.5) * 2;
    const yr = (event.clientY / window.innerHeight - 0.5) * 2;
    setMousePosRate({ x: xr, y: yr });
  };

  useEffect(() => {
    setTitleActive(true);
    return () => {
      if (curtainTimeoutRef.current) {
        clearTimeout(curtainTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="App" onMouseMove={onMouseMove}>
      <CSSTransition
        nodeRef={titlesRef}
        in={titleActive}
        timeout={2000}
        unmountOnExit={false}
        classNames="titles"
        onEntered={() => {
          setTitleActive(false);
          curtainTimeoutRef.current = setTimeout(() => {
            setCurtain(true);
          }, 4700);
        }}
        onExited={() => setExplosion(true)}
      >
        <div ref={titlesRef} className="titles">
          <div className="titles-container-l">
            <div className="title">p</div>
            <div className="title">4</div>
            <div className="title">k</div>
          </div>
          <CSSTransition
            nodeRef={tomatoRef}
            in={explosion}
            timeout={3000}
            unmountOnExit={false}
            classNames="tomato"
            onEntered={() => setExplosion(false)}
          >
            <div
              ref={tomatoRef}
              className="tomato"
              style={{
                left: -mousePosRate.x * 8,
                top: -mousePosRate.y * 8,
              }}
            >
              o
            </div>
          </CSSTransition>
          <div className="titles-container-r">
            <div className="title">.</div>
            <div className="title">c</div>
            <div className="title">o</div>
            <div className="title">m</div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={contentRef}
        in={curtain}
        timeout={1000}
        unmountOnExit={false}
        classNames="content"
        onEntered={() => {
          setAnimationDone(true);
        }}
      >
        <div ref={contentRef} className="content">
          <h1>p4ko.com</h1>
          {SOCIAL_LINKS.map((link) => (
            <div key={link.href}>
              <a target="_blank" href={link.href} rel="noreferrer">
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </CSSTransition>
    </div>
  );
}

export default App;

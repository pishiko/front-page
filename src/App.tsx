import React, { MouseEventHandler, useEffect, useState } from "react";
import "./App.css";
import { CSSTransition } from "react-transition-group";

function App() {
  const [titleActive, setTitleActive] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const [mousePosRate, setMousePosRate] = useState({ x: 0, y: 0 });

  const onMouseMove: MouseEventHandler = (event) => {
    if (!animationDone) return;
    const xr = (event.clientX / window.innerWidth - 0.5) * 2;
    const yr = (event.clientY / window.innerHeight - 0.5) * 2;
    setMousePosRate({ x: xr, y: yr });
  };

  useEffect(() => {
    setTitleActive(true);
  }, []);

  return (
    <div className="App" onMouseMove={onMouseMove}>
      <CSSTransition
        in={titleActive}
        timeout={2000}
        unmountOnExit={false}
        classNames={"titles"}
        onEntered={() => {
          setTitleActive(false);
          new Promise((resolve) => setTimeout(resolve, 4700)).then(() =>
            setCurtain(true)
          );
        }}
        onExited={() => setExplosion(true)}
      >
        <div className="titles">
          <div className="titles-container-l">
            <div className="title">p</div>
            <div className="title">4</div>
            <div className="title">k</div>
          </div>
          <CSSTransition
            in={explosion}
            timeout={3000}
            unmountOnExit={false}
            classNames={"tomato"}
            onEntered={() => setExplosion(false)}
          >
            <div
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
        in={curtain}
        timeout={1000}
        unmountOnExit={false}
        classNames={"content"}
        onEntered={() => {
          setAnimationDone(true);
        }}
      >
        <div className="content">
          <h1>p4ko.com</h1>
          <div>
            <a
              target={"_blank"}
              href="https://twitter.com/pishitaro_"
              rel="noreferrer"
            >
              Twitter (@pishitaro_)
            </a>
          </div>
          <div>
            <a target={"_blank"} href="https://blog.p4ko.com" rel="noreferrer">
              TechBlog (blog.p4ko.com)
            </a>
          </div>
          <div>
            <a target={"_blank"} href="https://note.com/p4k" rel="noreferrer">
              note (note.com/p4k)
            </a>
          </div>
          <div>
            <a
              target={"_blank"}
              href="https://github.com/pishiko"
              rel="noreferrer"
            >
              GitHub (github.com/pishiko)
            </a>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default App;

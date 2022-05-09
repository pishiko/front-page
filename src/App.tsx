import React, { useEffect, useState } from "react";
import "./App.css";
import { CSSTransition } from "react-transition-group";

function App() {
  const [titleActive, setTitleActive] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const [curtain, setCurtain] = useState(false);

  useEffect(() => {
    setTitleActive(true);
  }, []);

  return (
    <div className="App">
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
            <div className="tomato">o</div>
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
            <a target={"_blank"} href="https://memo.p4ko.com" rel="noreferrer">
              TechBlog (memo.p4ko.com)
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

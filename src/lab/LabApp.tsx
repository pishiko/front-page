import { useEffect, useRef, useState } from "react";
import "./LabApp.css";
import Giraffe from "./Giraffe";

export interface LabItem {
  id: string;
  title: string;
  description: string;
  url: string;
}

export const LAB_ITEMS: readonly LabItem[] = [
  {
    id: "exp-1",
    title: "Experiment 01",
    description: "Interactive canvas experiment",
    url: "https://example.com/exp1",
  },
  {
    id: "exp-2",
    title: "Experiment 02",
    description: "Web audio & generative synthesizer demo",
    url: "https://example.com/exp2",
  },
  {
    id: "exp-3",
    title: "Experiment 03",
    description: "Camera-based motion detection tool",
    url: "https://example.com/exp3",
  },
  {
    id: "exp-4",
    title: "Experiment 04",
    description: "Procedural animation playground",
    url: "https://example.com/exp4",
  },
];

interface LabAppProps {
  active?: boolean;
  onNavigateToTop?: () => void;
}

export default function LabApp({
  active = true,
  onNavigateToTop,
}: LabAppProps) {
  const [giraffeEntered, setGiraffeEntered] = useState(false);
  const [initialWobbleDone, setInitialWobbleDone] = useState(false);

  const entranceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wobbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const puppetRef = useRef<HTMLDivElement>(null);
  const initialWobbleDoneRef = useRef(false);

  useEffect(() => {
    if (active) {
      // 1. Slide giraffe up from bottom
      entranceTimerRef.current = setTimeout(() => {
        setGiraffeEntered(true);
      }, 200);

      // 2. Mark entrance momentum animation as finished so it never replays
      wobbleTimerRef.current = setTimeout(() => {
        setInitialWobbleDone(true);
        initialWobbleDoneRef.current = true;
      }, 1600);
    } else {
      setGiraffeEntered(false);
      setInitialWobbleDone(false);
      initialWobbleDoneRef.current = false;
      if (entranceTimerRef.current) clearTimeout(entranceTimerRef.current);
      if (wobbleTimerRef.current) clearTimeout(wobbleTimerRef.current);
    }

    return () => {
      if (entranceTimerRef.current) clearTimeout(entranceTimerRef.current);
      if (wobbleTimerRef.current) clearTimeout(wobbleTimerRef.current);
    };
  }, [active]);

  // Cursor-driven sway physics
  useEffect(() => {
    if (!active) {
      if (puppetRef.current) {
        puppetRef.current.style.transform = "rotate(0deg)";
      }
      return;
    }

    let currentAngle = 0;
    let velocity = 0;
    let lastX: number | null = null;
    let deltaX = 0;
    let lastMoveTime = 0;
    let rafId: number | null = null;

    const STIFFNESS = 0.22;
    const DAMPING = 0.78;
    const IMPULSE_FACTOR = 0.08;
    const MOVEMENT_THRESHOLD = 8; // Slight movements (< 8px per frame) are ignored
    const MAX_VELOCITY = 5.0;
    const MAX_ANGLE = 10;

    const safeRaf = (cb: FrameRequestCallback) => {
      if (typeof window !== "undefined" && window.requestAnimationFrame) {
        return window.requestAnimationFrame(cb);
      }
      return setTimeout(() => cb(Date.now()), 16) as unknown as number;
    };

    const safeCaf = (id: number) => {
      if (typeof window !== "undefined" && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(id);
      } else {
        clearTimeout(id as unknown as NodeJS.Timeout);
      }
    };

    const updatePhysics = () => {
      const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
      const isMoving = now - lastMoveTime < 60;

      // Only apply impulse if cursor movement exceeds threshold (deadzone for small/slow movements)
      const absDeltaX = Math.abs(deltaX);
      if (absDeltaX > MOVEMENT_THRESHOLD) {
        if (!initialWobbleDoneRef.current) {
          initialWobbleDoneRef.current = true;
          setInitialWobbleDone(true);
        }
        const effectiveDx = Math.sign(deltaX) * (absDeltaX - MOVEMENT_THRESHOLD);
        velocity += effectiveDx * IMPULSE_FACTOR;
        velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
      }
      deltaX = 0;

      // Harmonic spring force pulling back to 0deg (restrained elastic spring bounce)
      const springForce = -currentAngle * STIFFNESS;
      velocity = (velocity + springForce) * DAMPING;
      currentAngle += velocity;
      currentAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, currentAngle));

      // When cursor has stopped moving and spring has settled to rest: snap cleanly to 0 and halt RAF
      if (!isMoving && Math.abs(currentAngle) < 0.04 && Math.abs(velocity) < 0.04) {
        currentAngle = 0;
        velocity = 0;
        if (puppetRef.current) {
          puppetRef.current.style.transform = "rotate(0deg)";
        }
        rafId = null;
        return;
      }

      if (puppetRef.current) {
        puppetRef.current.style.transform =
          currentAngle === 0 ? "rotate(0deg)" : `rotate(${currentAngle.toFixed(2)}deg)`;
      }

      rafId = safeRaf(updatePhysics);
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = safeRaf(updatePhysics);
      }
    };

    const handlePointerMove = (clientX: number) => {
      if (lastX !== null) {
        const dx = clientX - lastX;
        deltaX += dx;
      }
      lastX = clientX;
      lastMoveTime = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
      scheduleUpdate();
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    const handleStop = () => {
      lastX = null;
      lastMoveTime = 0;
      scheduleUpdate();
    };

    const handleBlur = () => {
      lastX = null;
      lastMoveTime = 0;
      currentAngle = 0;
      velocity = 0;
      if (puppetRef.current) {
        puppetRef.current.style.transform = "rotate(0deg)";
      }
      if (rafId !== null) {
        safeCaf(rafId);
        rafId = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleStop, { passive: true });
    window.addEventListener("touchend", handleStop, { passive: true });
    window.addEventListener("touchcancel", handleStop, { passive: true });
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleStop);
      window.removeEventListener("touchend", handleStop);
      window.removeEventListener("touchcancel", handleStop);
      window.removeEventListener("blur", handleBlur);
      if (rafId !== null) {
        safeCaf(rafId);
        rafId = null;
      }
    };
  }, [active]);

  return (
    <div className="lab-page">
      <div className="lab-content">
        {/* Left column: Navigation, Title & Links */}
        <section className="lab-left">
          <a
            href="/"
            className="lab-back-link"
            aria-label="トップページに戻る"
            onClick={(e) => {
              if (
                !e.ctrlKey &&
                !e.metaKey &&
                !e.shiftKey &&
                !e.altKey &&
                e.button === 0
              ) {
                e.preventDefault();
                if (onNavigateToTop) {
                  onNavigateToTop();
                } else {
                  window.history.pushState(null, "", "/");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }
              }
            }}
          >
            ← Top
          </a>
          <h1 className="lab-title">p4ko.com/lab</h1>
          <p className="lab-subtitle">Experimental works & prototypes</p>

          <nav className="lab-links-list" aria-label="実験的制作物一覧">
            {LAB_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="lab-link-card"
              >
                <div className="lab-link-title">
                  {item.title} <span>→</span>
                </div>
                <p className="lab-link-desc">{item.description}</p>
              </a>
            ))}
          </nav>
        </section>

        {/* Right column: Giraffe Puppet Stage */}
        <section className="lab-right" aria-label="キリンの演出エリア">
          <div className="giraffe-stage">
            <div
              className={`giraffe-entrance ${giraffeEntered ? "entered" : ""}`}
              data-testid="giraffe-entrance"
            >
              <div
                ref={puppetRef}
                className={`giraffe-puppet ${giraffeEntered && !initialWobbleDone ? "entry-wobble" : ""}`}
                data-testid="giraffe-puppet"
              >
                <Giraffe />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

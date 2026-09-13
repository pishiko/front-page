import { ReactNode, useLayoutEffect, useRef, useState } from "react";

export default function FontLoader({ children }: { children: (ready: boolean) => ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const ready = status === "ready";

  useLayoutEffect(() => {
    if (containerRef.current) containerRef.current.inert = !ready;
  }, [ready]);

  useLayoutEffect(() => {
    let cancelled = false;
    // Include text from both pages so Japanese subsets are loaded before a visit to Lab, too.
    const text = containerRef.current?.textContent || "p4ko.com 日本語";
    const load = async () => {
      const faces = await Promise.all([
        document.fonts.load('700 16px "Poppins"', text),
        document.fonts.load('800 16px "Noto Sans JP"', text),
      ]);
      if (faces.some(group => group.length === 0)) {
        throw new Error("Required font definitions are unavailable");
      }
      await document.fonts.ready;
      if (!cancelled) setStatus("ready");
    };
    void load().catch(() => {
      if (!cancelled) setStatus("error");
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        data-fonts-ready={ready}
        aria-hidden={!ready}
        style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? undefined : "none" }}
      >
        {children(ready)}
      </div>
      {status === "error" && (
        <div role="alert" style={{ position: "fixed", inset: "2rem", color: "white", fontFamily: "sans-serif" }}>
          <p>フォントを読み込めませんでした。</p>
          <button onClick={() => window.location.reload()}>再読み込み</button>
        </div>
      )}
    </>
  );
}

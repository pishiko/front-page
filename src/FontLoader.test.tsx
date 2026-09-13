import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FontLoader from "./FontLoader";
import SiteApp from "./SiteApp";

describe("FontLoader", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, "fonts");
  });

  it("waits for Japanese and English fonts before showing the page or starting the intro", async () => {
    vi.useFakeTimers();
    let finishEnglish!: (faces: object[]) => void;
    let finishJapanese!: (faces: object[]) => void;
    const english = new Promise<object[]>(resolve => { finishEnglish = resolve; });
    const japanese = new Promise<object[]>(resolve => { finishJapanese = resolve; });
    const load = vi.fn((font: string) => font.includes("Poppins") ? english : japanese);
    Object.defineProperty(document, "fonts", { configurable: true, value: { load, ready: Promise.resolve() } });
    const { container } = render(
      <FontLoader>{ready => <SiteApp initialView="top" ready={ready} />}</FontLoader>
    );
    const gate = container.querySelector<HTMLElement>("[data-fonts-ready]")!;
    expect(load).toHaveBeenCalledWith('800 16px "Noto Sans JP"', expect.stringContaining("しずかなインターネット"));
    await act(async () => { finishEnglish([{}]); });
    act(() => vi.advanceTimersByTime(6000));
    expect(gate.style.opacity).toBe("0");
    expect(gate.inert).toBe(true);
    expect(container.querySelector(".tomato")).toHaveClass("tomato-whole");
    expect(container.querySelector(".tomato-entrance")).not.toHaveClass("tomato-arriving");

    await act(async () => { finishJapanese([{}]); });
    expect(gate.style.opacity).toBe("1");
    expect(gate.inert).toBe(false);
    expect(container.querySelector(".tomato-entrance")).toHaveClass("tomato-arriving");
    act(() => vi.advanceTimersByTime(4699));
    expect(container.querySelector(".tomato")).toHaveClass("tomato-whole");
    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelector(".tomato")).toHaveClass("tomato-exploding");
  });

  it("does not show the site in a fallback font when a required font is unavailable", async () => {
    Object.defineProperty(document, "fonts", { configurable: true, value: {
      load: vi.fn().mockResolvedValue([]), ready: Promise.resolve(),
    } });
    const { container } = render(<FontLoader>{() => <p>日本語</p>}</FontLoader>);
    expect(await screen.findByRole("alert")).toHaveTextContent("フォントを読み込めませんでした");
    expect(container.querySelector<HTMLElement>("[data-fonts-ready]")!.style.opacity).toBe("0");
  });
});

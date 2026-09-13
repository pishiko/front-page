import { act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import App from "./App";

describe("App", () => {
  afterEach(() => vi.useRealTimers());

  it("shows the UI immediately and reports completion only after the delayed explosion", () => {
    vi.useFakeTimers();
    const onAnimationDone = vi.fn();
    const { container } = render(<App onAnimationDone={onAnimationDone} />);
    const tomato = container.querySelector(".tomato")!;
    expect(container.querySelector(".tomato-entrance")).toHaveClass("tomato-arriving");
    expect(screen.getByRole("heading", { name: "p4ko.com" })).toBeVisible();
    act(() => vi.advanceTimersByTime(4699));
    expect(tomato).toHaveClass("tomato-whole");
    expect(onAnimationDone).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(tomato).toHaveClass("tomato-exploding");
    expect(onAnimationDone).not.toHaveBeenCalled();
    expect(container.querySelector(".App")).not.toHaveClass("background-revealed");
    fireEvent.animationEnd(tomato, { animationName: "tomato-explosion" });
    expect(tomato).toHaveClass("tomato-exploded");
    expect(container.querySelector(".App")).toHaveClass("background-revealed");
    expect(onAnimationDone).toHaveBeenCalledOnce();
  });

  it("renders heading and social links with correct attributes", () => {
    render(<App />);

    const heading = screen.getByText("p4ko.com", { selector: "h1" });
    expect(heading).toBeInTheDocument();

    const expectedLinks = [
      { text: "Twitter (@pishitaro_)", href: "https://twitter.com/pishitaro_" },
      { text: "GitHub (github.com/pishiko)", href: "https://github.com/pishiko" },
      { text: "TechBlog (blog.p4ko.com)", href: "https://blog.p4ko.com" },
      { text: "Note (note.com/p4k)", href: "https://note.com/p4k" },
      { text: "しずかなインターネット (sizu.me/p4k)", href: "https://sizu.me/p4k" },
    ];

    for (const { text, href } of expectedLinks) {
      const link = screen.getByText(text, { selector: "a" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("responds to the cursor only after the explosion finishes", () => {
    vi.useFakeTimers();
    const { container } = render(<App />);
    const appElement = container.querySelector(".App")!;
    const tomato = container.querySelector<HTMLElement>(".tomato")!;
    fireEvent.mouseMove(appElement, { clientX: 0, clientY: 0 });
    expect(tomato.style.translate).toBe("0px 0px");
    act(() => vi.advanceTimersByTime(4700));
    fireEvent.mouseMove(appElement, { clientX: 0, clientY: 0 });
    expect(tomato.style.translate).toBe("0px 0px");
    fireEvent.animationEnd(tomato, { animationName: "tomato-explosion" });
    expect(tomato.style.translate).toBe("0px 0px");
    fireEvent.mouseMove(appElement, { clientX: 0, clientY: 0 });
    expect(tomato.style.translate).toBe("8px 8px");
  });

  it("renders the navigation link to the Lab page", () => {
    render(<App />);
    const labLink = screen.getByRole("link", { name: "Go to Lab" });
    expect(labLink).toBeInTheDocument();
    expect(labLink).toHaveAttribute("href", "/lab/");
  });

  it("waits until the top page is opened before starting the entrance and explosion", () => {
    vi.useFakeTimers();
    const onAnimationDone = vi.fn();
    const { container, rerender } = render(
      <App startMode="wait" onAnimationDone={onAnimationDone} />
    );

    act(() => vi.advanceTimersByTime(6000));
    expect(container.querySelector(".tomato-entrance")).not.toHaveClass("tomato-arriving");
    expect(container.querySelector(".tomato")).toHaveClass("tomato-whole");
    rerender(<App startMode="normal" onAnimationDone={onAnimationDone} />);
    expect(container.querySelector(".tomato-entrance")).toHaveClass("tomato-arriving");
    act(() => vi.advanceTimersByTime(4700));
    expect(container.querySelector(".tomato")).toHaveClass("tomato-exploding");
  });

  it("immediately shows content when startMode is content", () => {
    const { container } = render(<App startMode="content" />);
    expect(screen.getByRole("heading", { name: "p4ko.com" })).toBeVisible();
    expect(container.querySelector(".tomato")).toHaveClass("tomato-exploded");
  });
});

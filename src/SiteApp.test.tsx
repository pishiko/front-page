import { act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SiteApp from "./SiteApp";

describe("SiteApp (Bidirectional Horizontal Slide Transition)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders top view by default and transitions bidirectionally", () => {
    render(<SiteApp initialView="top" />);

    const topWrapper = screen.getByTestId("top-view-wrapper");
    const labWrapper = screen.getByTestId("lab-view-wrapper");

    // Initially Top is in center, Lab is parked on the right
    expect(topWrapper).not.toHaveClass("on-lab");
    expect(labWrapper).not.toHaveClass("on-lab");

    // Click Lab →
    const labLink = screen.getByRole("link", { name: "Go to Lab" });
    fireEvent.click(labLink);

    // Top slides to the left (-100%), Lab enters from the right to center (0)
    expect(topWrapper).toHaveClass("on-lab");
    expect(labWrapper).toHaveClass("on-lab");

    // Click ← Top
    const backLink = screen.getByRole("link", { name: "トップページに戻る" });
    fireEvent.click(backLink);

    // Lab slides back to the right (+100%), Top slides back in from the left to center (0)
    expect(topWrapper).not.toHaveClass("on-lab");
    expect(labWrapper).not.toHaveClass("on-lab");
  });

  it("initializes directly into lab view when initialView is lab", () => {
    render(<SiteApp initialView="lab" />);

    const topWrapper = screen.getByTestId("top-view-wrapper");
    const labWrapper = screen.getByTestId("lab-view-wrapper");

    expect(topWrapper).toHaveClass("on-lab");
    expect(labWrapper).toHaveClass("on-lab");
  });

  it("plays the drop and explosion only on the first visit from lab to top", () => {
    const { container } = render(<SiteApp initialView="lab" />);
    act(() => vi.advanceTimersByTime(6000));
    expect(container.querySelector(".tomato-entrance")).not.toHaveClass("tomato-arriving");

    // Click ← Top
    const backLink = screen.getByRole("link", { name: "トップページに戻る" });
    fireEvent.click(backLink);

    expect(container.querySelector(".tomato-entrance")).toHaveClass("tomato-arriving");
    act(() => vi.advanceTimersByTime(4700));
    const tomato = container.querySelector(".tomato")!;
    expect(tomato).toHaveClass("tomato-exploding");
    fireEvent.animationEnd(tomato, { animationName: "tomato-explosion" });
    fireEvent.click(screen.getByRole("link", { name: "Go to Lab" }));
    fireEvent.click(backLink);
    act(() => vi.advanceTimersByTime(6000));
    expect(tomato).toHaveClass("tomato-exploded");
    expect(container.querySelector(".tomato-entrance")).not.toHaveClass("tomato-arriving");
  });

  it("does not restart the timer when visiting lab during the first entrance", () => {
    const { container } = render(<SiteApp initialView="lab" />);
    const backLink = screen.getByRole("link", { name: "トップページに戻る" });
    fireEvent.click(backLink);
    act(() => vi.advanceTimersByTime(500));
    const entrance = container.querySelector(".tomato-entrance");
    fireEvent.click(screen.getByRole("link", { name: "Go to Lab" }));
    act(() => vi.advanceTimersByTime(500));
    fireEvent.click(backLink);
    expect(container.querySelector(".tomato-entrance")).toBe(entrance);
    act(() => vi.advanceTimersByTime(3700));
    expect(container.querySelector(".tomato")).toHaveClass("tomato-exploding");
  });

  it("keeps the top-page explosion scheduled after the UI is already visible", () => {
    const { container } = render(<SiteApp initialView="top" />);
    const tomato = container.querySelector(".tomato")!;
    act(() => vi.advanceTimersByTime(1000));
    expect(tomato).toHaveClass("tomato-whole");
    act(() => vi.advanceTimersByTime(3700));
    expect(tomato).toHaveClass("tomato-exploding");
    fireEvent.animationEnd(tomato, { animationName: "tomato-explosion" });
    expect(tomato).toHaveClass("tomato-exploded");
  });
});

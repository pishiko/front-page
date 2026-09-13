import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LabApp, { LAB_ITEMS } from "./LabApp";

describe("LabApp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the page title and subtitle", () => {
    render(<LabApp />);
    expect(screen.getByText("p4ko.com/lab")).toBeInTheDocument();
    expect(
      screen.getByText("Experimental works & prototypes")
    ).toBeInTheDocument();
  });

  it("renders the back-to-top link", () => {
    render(<LabApp />);
    const backLink = screen.getByRole("link", { name: "トップページに戻る" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders all experimental links with correct URLs", () => {
    render(<LabApp />);

    for (const item of LAB_ITEMS) {
      const link = screen.getByText(new RegExp(item.title));
      expect(link).toBeInTheDocument();

      const anchor = link.closest("a");
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute("href", item.url);
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("renders the giraffe puppet illustration", () => {
    render(<LabApp />);
    const giraffeImg = screen.getByRole("img", { name: "キリンのイラスト" });
    expect(giraffeImg).toBeInTheDocument();
  });

  it("progresses giraffe entrance animation with timers", () => {
    render(<LabApp active={true} />);

    const giraffe = screen.getByTestId("giraffe-entrance");
    expect(giraffe).not.toHaveClass("entered");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(giraffe).toHaveClass("entered");
  });

  it("cleans up all timers on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(<LabApp />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it("does not sway on slight mouse movements below threshold", () => {
    render(<LabApp active={true} />);
    const puppet = screen.getByTestId("giraffe-puppet");

    // Move cursor slightly (< 8px)
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 100 }));
    });
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 104 })); // delta = 4px (< 8px)
      vi.advanceTimersByTime(32);
    });

    // Puppet remains resting at 0deg
    expect(puppet.style.transform).toBe("rotate(0deg)");
  });

  it("sways the puppet like an elastic spring on deliberate mouse movement and returns to 0deg when cursor stops", () => {
    render(<LabApp active={true} />);
    const puppet = screen.getByTestId("giraffe-puppet");

    // Move cursor right deliberately (delta = 60px > 8px)
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 100 }));
    });
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 160 }));
      vi.advanceTimersByTime(32);
    });

    // Puppet tilts clockwise with momentum
    expect(puppet.style.transform).toMatch(/rotate\([1-9]/);

    // Stop moving cursor: spring rebounds (oscillates)
    act(() => {
      vi.advanceTimersByTime(120);
    });
    // Elastic spring rebound reaches counter-angle (negative deg)
    expect(puppet.style.transform).toMatch(/rotate\(-/);

    // Advance time for spring oscillation to fully dampen
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Puppet settles back to 0deg
    expect(puppet.style.transform).toBe("rotate(0deg)");
  });

  it("resets sway to 0deg on window blur", () => {
    render(<LabApp active={true} />);
    const puppet = screen.getByTestId("giraffe-puppet");

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 100 }));
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 180 }));
      vi.advanceTimersByTime(32);
    });

    expect(puppet.style.transform).not.toBe("rotate(0deg)");

    act(() => {
      window.dispatchEvent(new Event("blur"));
    });

    expect(puppet.style.transform).toBe("rotate(0deg)");
  });
});

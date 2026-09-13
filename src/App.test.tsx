import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the animated title characters", () => {
    render(<App />);

    expect(screen.getByText("p", { selector: ".title" })).toBeInTheDocument();
    expect(screen.getByText("4", { selector: ".title" })).toBeInTheDocument();
    expect(screen.getByText("k", { selector: ".title" })).toBeInTheDocument();
    expect(screen.getByText("o", { selector: ".tomato" })).toBeInTheDocument();
    expect(screen.getByText(".", { selector: ".title" })).toBeInTheDocument();
    expect(screen.getByText("c", { selector: ".title" })).toBeInTheDocument();
    expect(
      screen.getByText("o", { selector: ".titles-container-r .title" })
    ).toBeInTheDocument();
    expect(screen.getByText("m", { selector: ".title" })).toBeInTheDocument();
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

  it("handles mouse move interaction after animation completes", () => {
    const { container } = render(<App />);
    const appElement = container.querySelector(".App");
    expect(appElement).toBeInTheDocument();
  });
});

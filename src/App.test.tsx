import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: new Proxy(
    {},
    {
      get:
        (_, tag: string) =>
        ({ children, initial, animate, exit, transition, ...props }: Record<string, unknown>) => {
          const Component = tag as "div";
          return <Component {...props}>{children as ReactNode}</Component>;
        }
    }
  )
}));

vi.mock("./components/AtomScene", () => ({
  AtomScene: () => <div data-testid="mock-atom-scene" />
}));

vi.mock("./components/LabScene", () => ({
  LabScene: () => <div data-testid="mock-lab-scene" />
}));

describe("App experiment flow", () => {
  it("opens the lab with today's water experiment when the challenge start button is clicked", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /시작하기/i }));

    expect(screen.getByRole("heading", { name: "분자 결합 실험실" })).toBeInTheDocument();
    expect(screen.getByText("오늘의 실험: H₂O 만들기")).toBeInTheDocument();
    expect(screen.getByText("수소 두 개와 산소 하나를 직접 추가해 물 분자를 완성하세요.")).toBeInTheDocument();
  });
});

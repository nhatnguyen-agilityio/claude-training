import { act, render, screen } from "@testing-library/react";
import Hello from ".";

test("renders Hello component", () => {
  act(() => {
    render(<Hello />);
  });

  expect(screen.getByText("Hello World")).toBeInTheDocument();

  act(() => {
    render(<Hello props={{ name: "React" }} />);
  });

  expect(screen.getByText("Hello React")).toBeInTheDocument();
});

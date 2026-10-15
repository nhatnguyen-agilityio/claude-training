import { act, render, screen } from "@testing-library/react";
import DelayMessage from ".";

jest.useFakeTimers();

test("show delayed message after 3 seconds", async () => {
  render(<DelayMessage />);

  expect(screen.getByText("Waiting...")).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(screen.getByText("Hello, this is a delayed message!")).toBeInTheDocument();
});

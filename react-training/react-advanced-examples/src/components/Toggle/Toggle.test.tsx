import { render, screen, waitFor } from "@testing-library/react";
import Toggle from ".";
import userEvent from "@testing-library/user-event";

test("test rendering Toggle component", () => {
  render(<Toggle />);
  expect(screen.getByRole("button", { name: "OFF" })).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "OFF" }));

  waitFor(() => {
    expect(screen.getByRole("button", { name: "ON" })).toBeInTheDocument();
  }
  );
});

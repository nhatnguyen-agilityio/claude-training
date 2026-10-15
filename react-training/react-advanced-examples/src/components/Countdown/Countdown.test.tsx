import { fireEvent, render, screen } from "@testing-library/react";
import Countdown from ".";
import { MemoryRouter } from "react-router-dom";
import * as CountdownHook from "@/Hooks/Countdown";

jest.mock("@/hooks/Countdown", () => ({
  useCountdown: jest.fn(),
}));

describe("Countdown component", () => {
  test("render correctly", () => {
    const mockedUseCountdown = CountdownHook.useCountdown as jest.Mock;
    mockedUseCountdown.mockReturnValue(10);

    render(
      <MemoryRouter>
        <Countdown />
      </MemoryRouter>
    );

    expect(screen.getByText("Countdown")).toBeInTheDocument();
    expect(screen.getByText("The time left:10 seconds")).toBeInTheDocument();
    expect(screen.getByText(/seconds/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Countdown input")).toBeInTheDocument();
    expect(screen.getByLabelText("Countdown label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Input here")).toBeInTheDocument();

    const input = screen.getAllByRole("textbox")[0] as HTMLInputElement;

    fireEvent.change(input, { target: { value: "20" } });
    expect(input.value).toBe("20");
    expect(screen.queryByText("new text")).toBeNull();
  });
});

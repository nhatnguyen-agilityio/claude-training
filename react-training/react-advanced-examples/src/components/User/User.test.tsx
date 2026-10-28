import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import User from ".";

describe("User", () => {
  test("renders User component", () => {
    render(<User />);

    expect(screen.queryByText(/Signed in as/)).toBeNull();

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Hello" },
    });

    waitFor(() => {
      expect(screen.getByText(/Searches for Hello/)).toBeInTheDocument();
    });

    screen.debug();
  });
});

jest.mock("./Search", () => {
  return function MockedSearch({ value, onChange, children }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; children: React.ReactNode; }) {
    return (
      <div>
        <label>{value}</label>
        <input type="text" onChange={onChange} />
        {children}
      </div>
    );
  };
});

describe("User Search", () => {
  test("renders User with Search component", async () => {
    render(<User />);

    fireEvent.change(screen.getAllByRole("textbox")[0], {
      target: { value: "Hello" },
    });

    waitFor(() => {
      expect(screen.getByText(/Search: Hello/)).toBeInTheDocument();
    });
  });
});

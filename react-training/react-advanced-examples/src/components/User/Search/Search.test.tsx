import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Search from ".";

describe("User Search", () => {
  test("renders User Search component", async () => {
    const onChange = jest.fn();

    render(<Search value="" onChange={onChange}>Search: </Search>);

    await userEvent.type(screen.getByRole("textbox"), "Hello React");

    expect(onChange).toHaveBeenCalledTimes(11);
  });
});

import { cleanup, render, fireEvent } from "@testing-library/react";
import CheckboxWithLabel from ".";

afterEach(cleanup);

const compileAndroidCode = () => {
  throw new Error("you are using the wrong JDK");
}

it("CheckboxWithLabel changes the text after click", () => {
  const { getByLabelText } = render(
    <CheckboxWithLabel labelOn="On" labelOff="Off" />
  );

  expect(getByLabelText(/off/i)).toBeTruthy();

  fireEvent.click(getByLabelText(/off/i));

  expect(getByLabelText(/on/i)).toBeTruthy();

  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeTruthy();
  expect(n).not.toBeUndefined();
  expect(n).toBeFalsy();

  const total = 5+5;
  expect(total).toBeGreaterThan(9);
  expect(total).toBeLessThan(11);
  expect(total).toBeGreaterThanOrEqual(10);
  expect(total).toBeLessThanOrEqual(10);
  expect(total).toBe(10);
  expect(total).toEqual(10);

  const amount = 3.2;
  expect(amount).toBeCloseTo(3.2);

  const phrase = "Hello World";

  expect(phrase).toMatch(/world/i);

  const shoppingList = [
    "diapers",
    "kleenex",
    "trash bags",
    "paper towels",
    "milk",
  ];

  expect(shoppingList).toContain("milk");

  expect(compileAndroidCode).toThrow("you are using the wrong JDK");
});

// Mock global fetch before tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve('peanut butter'),
    text: () => Promise.resolve('peanut butter'),
  } as Response)
);

test("the data is peanut butter", () => {
  return fetch('https://some-api.com/data')
    .then(response => response.json())
    .then(data => {
      expect(data).toBe('peanut butter');
    });
});

test("test data is peanut butter (1)", async () => {
  const response = await fetch('https://some-api.com/data');
  const data = await response.json();
  expect(data).toBe('peanut butter');
});

test("test data is peanut butter (2)", async () => {
  interface FetchDataCallback {
    (error: Error | null, data: string): void;
  }

  function fetchData(callback: FetchDataCallback): void {
    setTimeout(() => {
      callback(null, 'peanut butter');
    }, 100);
  }

  function callback(error: Error | null, data: string) {
    if (error) {
      throw error;
    } else {
      expect(data).toBe('peanut butter');
    }
  }
  fetchData(callback);
});

test("test data is peanut butter (3)", async () => {
  return expect(
    fetch('https://some-api.com/data')
      .then(response => response.json())
  ).resolves.toBe('peanut butter');
});

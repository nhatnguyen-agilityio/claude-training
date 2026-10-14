const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");

// "Reload" the page: reset the HTML and run app.js again (localStorage is kept)
const loadPage = () => {
  document.documentElement.innerHTML = html;
  jest.resetModules();
  require("../script/app.js");
};

const addTodo = (text) => {
  document.getElementById("text").value = text;
  document.querySelector(".todo-form").dispatchEvent(new Event("submit"));
};

// find todos by text, not by position (position is what the bug gets wrong)
const findTodo = (text) =>
  [...document.querySelectorAll(".todo")].find(
    (todo) => todo.querySelector(".todo-text").textContent === text
  );

const todoTexts = () =>
  [...document.querySelectorAll(".todo-text")].map((p) => p.textContent);

const isCompleted = (text) => findTodo(text).querySelector(".check").checked;

const markCompleted = (text) => findTodo(text).querySelector(".check").click();

const deleteTodo = (text) => findTodo(text).querySelector(".remove").click();

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("todos", "[]"); // avoid the separate forEach null bug
  loadPage();
  ["A", "B", "C"].forEach(addTodo);
});

describe("completed todos after reloading the page", () => {
  // Scenario 1: the bug from the Trello card
  test("keeps a completed todo after deleting a todo above it and reloading", () => {
    markCompleted("C");

    deleteTodo("A");
    loadPage();

    expect(todoTexts()).toEqual(["B", "C"]);
    expect(isCompleted("C")).toBe(true);
    expect(isCompleted("B")).toBe(false);
  });

  // Scenario 2: control, no delete
  test("keeps a completed todo after reloading when nothing is deleted", () => {
    markCompleted("C");

    loadPage();

    expect(isCompleted("C")).toBe(true);
    expect(isCompleted("A")).toBe(false);
    expect(isCompleted("B")).toBe(false);
  });

  // Scenario 3: the completed status must not move to another todo
  test("does not move the completed status to another todo after a delete", () => {
    markCompleted("B");

    deleteTodo("A");
    loadPage();

    expect(isCompleted("B")).toBe(true);
    expect(isCompleted("C")).toBe(false);
  });

  // Scenario 4: unticking must also be saved
  test("keeps a todo uncompleted after unticking it and reloading", () => {
    markCompleted("C"); // tick
    markCompleted("C"); // click again = untick

    loadPage();

    expect(isCompleted("C")).toBe(false);
  });

  // Scenario 5: right-click delete must keep the completed status too
  test("keeps a completed todo after right-click deleting a todo above it and reloading", () => {
    markCompleted("C");

    findTodo("A").dispatchEvent(new Event("contextmenu"));
    loadPage();

    expect(todoTexts()).toEqual(["B", "C"]);
    expect(isCompleted("C")).toBe(true);
  });

  // Scenario 6: todos saved by the old version (completed status kept by position)
  test("keeps the completed status of todos saved by the old version", () => {
    localStorage.clear();
    localStorage.setItem("todos", JSON.stringify([{ todo: "A" }, { todo: "C" }]));
    localStorage.setItem("completed", "[1]");

    loadPage();

    expect(isCompleted("A")).toBe(false);
    expect(isCompleted("C")).toBe(true);
    expect(localStorage.getItem("completed")).toBeNull();

    loadPage();

    expect(isCompleted("C")).toBe(true);
  });
});

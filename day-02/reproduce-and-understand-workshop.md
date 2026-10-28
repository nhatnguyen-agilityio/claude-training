# Day 02: Reproduce and Understand Workshop

**Training project:** ToDo App (JavaScript Training)
**Date:** 2026-10-13
**Ticket:** [BUG: ToDo App — completed todos become uncompleted after refreshing the page](https://trello.com/c/DhqL1mqO/22-bug-todo-app-completed-todos-become-uncompleted-after-refreshing-the-page)

---

## 1. Workshop: Reproduce the bug

### What the workshop asked
- Take one **seeded bug ticket** (a bug planted on purpose).
- Get the app **running locally from scratch**.
- **Reproduce** the bug.
- Write **exact repro steps** into the ticket.

### What I did
- Created a seeded bug ticket on my Trello board for my ToDo App. The reporter said: *"Completed todos become uncompleted after refreshing, sometimes, not always."*
- Ran the app locally and started from a clean state.
- Reproduced the bug and found its exact trigger: it only happens when a todo **above** a completed todo is **deleted** before the page is refreshed.
- Ran a **control test**: without a delete, the bug does not happen. That explains why the reporter said "sometimes".
- Used **Chrome DevTools** to collect evidence of the cause.
- Wrote complete repro steps into the ticket: steps, expected result, actual result, frequency and evidence.
- Noticed a **second, separate bug** during setup.

---

## 2. Exercise: Express the bug as a failing test

### What the exercise asked
- Turn the bug into an automated test that **fails today** and **passes after the fix**.
- **BA / QA** describe what the test should check. **Devs** write the test. Both pair to see it written.

### What I did
- Practiced the **BA side** by describing the expected behavior as **Given / When / Then** scenarios:
  - the bug scenario
  - a control scenario
  - a scenario where the completed status moves to the wrong todo
- Practiced the **dev side** by choosing a test tool (**Jest + jsdom**) for a project that had no tests yet.
- Got a test that **fails for the right reason**, at the expected check and not because of a setup problem.
- After the fix, **all tests passed**, and the test now stays in the project as a regression test.
- Recorded the test result on the Trello ticket.

---

## 3. What I learned

1. **Reproduce before fixing.** Seeing the bug yourself shows what's really wrong, not what the ticket says is wrong.
2. **"Sometimes" means a hidden condition.** Change one thing at a time until the bug happens every time.
3. **A control test proves the cause.** Showing when the bug *doesn't* happen is as useful as showing when it does.
4. **Good repro steps need no explanation.** Anyone should be able to follow them and see the same bug.
5. **Evidence beats description.** Real data from DevTools is clearer than "it's broken".
6. **BA/QA and dev work together on tests.** The BA defines *what* to check in plain words, and the dev turns it into code.
7. **A failing test must fail for the right reason.** Otherwise it proves nothing.
8. **A test written before the fix proves the fix**, and it keeps the bug from coming back.

---

## 4. What I achieved

- ✅ Created and managed a bug ticket on my own Trello board
- ✅ Ran the app locally and reproduced a "sometimes" bug every time
- ✅ Found the exact trigger and the root cause of the bug
- ✅ Wrote a complete bug report that anyone can follow
- ✅ Practiced both the **BA** role (writing assertions) and the **dev** role (setting up tests)
- ✅ Turned a bug into a failing test, then saw it pass after the fix
- ✅ Found an extra bug that wasn't in the ticket

---

## 5. Next steps

- [ ] Reproduce the bug by hand again in my own browser
- [ ] Write one more test scenario myself
- [ ] Walk through the ticket and test with a real partner
- [ ] Create a ticket for the second bug I found
- [ ] Move the ticket to **Done** on Trello

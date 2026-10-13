# Summary a bug

A prompt practice log: three prompts that summarize the same bug ticket (SHOP-482, checkout returns 500 and customers are charged twice), with what each prompt produced and what changed between them.

---

## Prompt A

> I have an bug ticket below, could you please help me summary that
>
> *(full ticket pasted: support report, Sentry traceback, `create_payment()` code, release notes, Slack thread)*

### Result

- **What I got:** a long, detailed write-up of about 450 words with six sections: what's happening, likely root cause (step-by-step race condition), what's probably not the cause, suggested fixes, and open questions.
- **What was good:**
  - Pasting the *whole* ticket (logs, code, release notes, Slack) gave Claude everything it needed to find the real root cause: the removed double-submit guard plus the check-then-charge race in `create_payment()`.
  - It also ruled out the red herrings (Django 5, datetime warnings, Stripe incident).
- **What was missing:**
  - No **audience**, so Claude didn't know who would read it and wrote for an engineer working on the bug.
  - No **length limit**, so the summary was long.
  - No **format**, so Claude picked its own sections.
- **Lesson:** good input (full context) gives good analysis, but without audience, length, and format the output may not fit what you need.

---

## Prompt B

> Summary this bug again for my tech lead. The format need clear about Impact, Root cause, how it affects the user, and the idea to fix. Under 200 words

### Result

- **What I got:** a short summary (under 200 words) with exactly the four sections I asked for: Impact, Root cause, What the user sees, How to fix.
- **What improved from A:**
  - **Audience** ("for my tech lead") made the tone direct and the content focused on decisions.
  - **Named sections** made the structure predictable and easy to scan.
  - **Word limit** forced Claude to keep only what matters.
- **What was still missing:**
  - Everything was stated as fact, including things that were really guesses: that the double tap triggers the bug, that the double charges come from this race, the "1 in 50" rate.
  - A tech lead needs to know what is **confirmed** and what still **needs checking** before acting on it.
- **Lesson:** audience + format + length is a strong combination, but you also need to say how *certain* the content should sound.

---

## Prompt C

> Please help me summary this bug again for my technical lead. The format must clearly cover Impact, Root cause, what affect to the user, and the idea to fix. Under 200 words. Need clearly separate what the evidence proves from what is a guess.

### Result

- **What I got:** the same four sections, under 200 words, but each section is now split into **Proven**, **Likely / not yet proven**, and **Not yet known**.
- **What improved from B:**
  - The summary is now **honest about certainty**. For example:
    - **Proven:** the 500 is a duplicate-payment `IntegrityError`; the code has no lock; the guard was removed.
    - **Likely:** the double tap causes the race (supported by one customer's report only).
    - **Not yet known:** whether the double charges come from the race or from customers reordering.
  - The fix list now includes a step to **confirm the cause** (compare Stripe charges with `Payment` rows), not just fix it.
  - The tech lead can see what to trust and what to verify.
- **Lesson:** asking Claude to separate evidence from guesses is one of the most valuable instructions for technical summaries. It prevents confident-sounding statements that turn out to be wrong.

---

## Final summary: what each prompt change added

| Prompt | What I added | Effect on the result |
|---|---|---|
| A | Full context (ticket, logs, code, release notes, Slack) | Correct, deep analysis, but long and in a format Claude chose |
| B | **Audience** + **required sections** + **word limit** | Short, structured, fit for a tech lead, but guesses sounded like facts |
| C | **Separate proven facts from guesses** | Trustworthy summary that shows what is confirmed and what still needs checking |

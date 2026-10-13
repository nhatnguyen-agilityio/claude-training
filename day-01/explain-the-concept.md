# Title: Explain this concept

**Topic:** Django migrations (`makemigrations` and `migrate`)
**Goal of this file:** Track how each prompt changed and how each change affected the answer.

---

## Prompt A: My first prompt

> Could you please help me explain details about this concept?
> I'm a Django developer. I run makemigrations and migrate all the time, but I'm not sure what actually happens behind the scenes or why migration conflicts happen.

### Result

**What I received:**
- A long, advanced answer (well over 1,500 words) written for an **experienced** Django developer.
- Internal details: in-memory `ProjectState`, the `MigrationAutodetector`, the migration **dependency graph (DAG)** and "leaf nodes", schema editor, transactions per database.
- A full section on **migration conflicts**: why two `0004_` files break the graph, and two ways to fix it (`makemigrations --merge` or re-generating).
- Extra topics nobody asked for: `RunPython` and historical models, `--fake`, `InconsistentMigrationHistory`, squashing, CI checks.

**What worked:**
- I gave **context** ("I'm a Django developer", "I run these commands all the time").
- I asked **two specific questions** (behind the scenes + why conflicts happen), and both were answered.

**What didn't work well:**
- "**this concept**" is vague; the real topic only appears in the second sentence.
- "I'm a Django developer" + "all the time" made Claude assume I was **experienced**, so the answer was too deep for a beginner.
- **No length limit** and **no format**, so the answer became very long.
- I didn't say **how** I like to learn (examples, analogies, steps).

---

## Prompt B: Second prompt

> I'm a developer and first time move to learn Django. I have used migration and migrate but I don't know what actual it do. Could you please help me explain it, give me some real-world analogy. The result need let me know what they actual do and what is different about migration and migrate. Keep it under 600 words

### Result

**What I received:**
- A short, beginner-friendly answer (about 550 words, within the limit).
- A **real-world analogy**: house renovation:
  - `models.py` = the owner's idea
  - `makemigrations` = the architect who writes the plans
  - migration files = the written instructions
  - `migrate` = the builder who changes the house
  - `django_migrations` table = the builder's checklist
- A simple example: adding a `price` field, the generated migration file, and the SQL `migrate` runs.
- A **comparison table** showing the difference between `makemigrations` and `migrate`.
- A short explanation of why there are two steps, plus a one-line rule of thumb.
- Migration **conflicts were not covered**, because this prompt didn't ask about them.

**What I improved compared to Prompt A:**
| Change | Effect on the answer |
|---|---|
| Said "**first time** learning Django" (my real level) | Simple words, no deep internals |
| Asked for a **real-world analogy** | Got the house-renovation analogy that ties everything together |
| Stated the **expected outcome** ("what they actually do and the difference") | Got a clear comparison table |
| Added a **length limit** ("under 600 words") | The answer was short and focused |

**What could still be better:**
- "I'm a developer **and** first time learning Django" is a bit unclear. Better: *"I'm experienced in [language], but new to Django."*
- "migration and migrate" should use the exact command names: **`makemigrations` and `migrate`**.
- If I still wanted to understand **conflicts**, I should have asked again; a new prompt only answers what it asks.
- Some grammar slips ("what actual it do"). Claude understood, but clearer wording lowers the risk of misunderstanding.

---

## Final summary: what each prompt change taught me

| Prompt | Main change | Result |
|---|---|---|
| **A** | Context + two questions, but no level, length or format | Correct but too long and too advanced |
| **B** | Real level (beginner) + analogy + expected outcome + word limit | Short, clear, easy to understand |

# Day 02: Ticket Analysis Workshop

**Training topic:** LangGraph customer service agent
**Date:** 2026-10-13

---

## 1. What I had to do

### Exercise 1: Ticket analysis workshop
- Take 5 real tickets from the training backlog.
- For each ticket, write a three-sentence analysis:
  - **What it asks:** the goal, in my own words
  - **What's ambiguous:** what is unclear or missing
  - **First step:** one concrete action to start
- Use Claude to find gaps and draft clarifying questions.
- Compare my analysis with a partner's analysis.

### Exercise 2: Questions and role-play
- Write the questions I would ask the reporter.
- Role-play in pairs: one person is the reporter, the other is the developer.

### Who does what

| Task | Me | Claude |
|---|---|---|
| Pick the tickets | ✅ | ❌ |
| Write the three-sentence analysis | ✅ (first, on my own) | ❌ |
| Find gaps | ✅ | ✅ reviews my analysis |
| Draft clarifying questions | ✅ select, edit, order | ✅ writes drafts |
| Compare with a partner | ✅ | ❌ |
| Role-play | ✅ developer | ✅ reporter |

---

## 2. The 5 tickets I chose

| # | Ticket | Type |
|---|---|---|
| 1 | CS-306: Create the order lookup tool and node | Feature |
| 2 | CS-308: Create the FAQ search node | Feature |
| 3 | CS-310: Connect all nodes and edges, then compile the graph | Feature |
| 4 | CS-313: Add error handling and fallback responses | Improvement |
| 5 | CS-402: LLM call fails with "Invalid API key" error | Bug |

---

## 3. Final three-sentence analyses

### CS-306: Create the order lookup tool and node
- **What it asks:** Create a tool that fetches order details by order ID. The LangGraph node uses it when the router sends an order question and returns the result to the customer.
- **What's ambiguous:** Where the order data comes from, which order information to show the customer, and what to do if the order ID is missing.
- **First step:** Ask the reporter about the data source, then write a `get_order_information` tool with mock data and test it with 2 valid IDs, 1 non-existent ID and 1 empty input.

### CS-308: Create the FAQ search node
- **What it asks:** Create a node (and tool) that answers FAQ questions. LangGraph uses it when the router sends an FAQ-related question and returns the result to the customer.
- **What's ambiguous:** Where the FAQ data comes from, what to do when no FAQ matches the question, and what information to return to the customer.
- **First step:** Ask the reporter about the data source, the answer format and the "no match" behavior, then write a `get_faq_information` tool with 5 sample FAQs and test it with matching, reworded and unrelated questions.

### CS-310: Connect all nodes and edges, then compile the graph
- **What it asks:** Build the full StateGraph so a customer message flows from intent classification to the right node (order lookup, FAQ, refund or escalation) and the compiled graph runs end to end.
- **What's ambiguous:** Whether all node tickets (CS-304 to CS-309) are finished, where the graph ends after a node answers, whether loops are allowed, whether the checkpointer belongs here or in CS-311, and what counts as "done".
- **First step:** Review the completed tickets CS-303 to CS-309 and draw a diagram of the nodes and routes, then confirm the diagram and the checkpointer scope with the reporter before writing the StateGraph.

### CS-313: Add error handling and fallback responses
- **What it asks:** Make the agent handle failures gracefully, so the customer sees a friendly message instead of a technical error and developers can still see the real error in logs.
- **What's ambiguous:** Which failures to handle (LLM, tool or API, unknown intent), whether to retry before showing an error, what happens after an error (continue, end or escalate), and whether there is existing wording for the messages.
- **First step:** List every place in the graph that can fail (the LLM call, each tool and the router) and draft how each failure is handled, then review the draft with the reporter.

### CS-402: LLM call fails with "Invalid API key" error
- **What it asks:** Fix the agent so it can call the LLM successfully, because right now customer messages fail with an "Invalid API key" error.
- **What's ambiguous:** Which environment fails, whether it ever worked and when it stopped, whether anything changed recently (a new key or a deploy), and whether every message fails or only some.
- **First step:** Ask the reporter which environment fails and when it started, then check that the key is loaded at runtime (printing only whether it exists and its first few characters) and confirm in the provider dashboard that the key is still active.

---

## 4. Gaps Claude found that I missed

| Ticket | Gaps I missed |
|---|---|
| CS-306 | Order ID format and validation; **customer verification** (privacy: customers must see only their own orders); how the order ID gets into the state; API timeouts |
| CS-308 | Search method (keyword or semantic); whether the LLM rephrases the answer; several matching FAQs; who updates the FAQ content |
| CS-310 | **Checkpointer is out of scope** (it's a separate ticket, CS-311); dependencies on the node tickets; `START` and `END` points; loops and `GraphRecursionError`; acceptance criteria |
| CS-313 | Which errors to handle; per-node or global handling; retries; what happens after an error; logging for developers; fallback for unknown intent |
| CS-402 | Whether it ever worked; recent changes or deploys; every message or only some; provider and variable name; production may use a secrets manager instead of `.env` |

---

## 5. Clarifying questions for the reporter

### CS-306
1. Where does the order data come from: a real API, a database or mock data?
2. Which order fields should the customer see?
3. Should customers see only their own orders? How do we verify who they are?
4. If the customer doesn't give an order ID, should the agent ask for it or escalate?

### CS-308
1. Where are the FAQs stored, and how many are there?
2. Should search be keyword-based or meaning-based (semantic)?
3. When no FAQ matches, should the agent apologize, ask the customer to rephrase or hand off to a human?
4. Should the agent return the FAQ text as written, or rephrase it?

### CS-310
1. Here is my diagram of the flow. Is it correct?
2. Is the checkpointer part of this ticket, or does it stay in CS-311?
3. After a node answers, should the graph end or wait for the next message?
4. What counts as "done": does it only need to compile, or must test conversations pass?

### CS-313
1. Which failures matter most: LLM errors, tool or API errors, or unclear customer messages?
2. Should the agent retry before showing an error? If so, how many times?
3. After an error, should the conversation continue, end or escalate to a human?
4. Do we have brand wording for error messages, or should I draft it?

### CS-402 (used in the role-play)
1. Which environment shows the error?
2. Did this ever work? If so, when did it stop?
3. Was anything deployed or changed around that time?

---

## 6. Role-play: CS-402 "Invalid API key"

**Roles:** I was the developer and Claude was Linh, the QA reporter.

### How the conversation went
1. I asked which environment fails → "probably staging".
2. I asked how often it fails → every message, but it **worked last week**.
3. I asked what changed → Tom posted about **rotating keys** on Friday.
4. I checked staging and found the **API key had been removed**. Tom had removed the wrong key. I added it again.
5. I asked the reporter to check the other environments → **UAT had the same error**. QA has no PROD access.
6. The key was re-added in all environments. Linh verified Staging and UAT and marked the ticket **Done**.

**Root cause:** the API key was removed by mistake during key rotation.
**Fix:** re-added the key in Staging, UAT and PROD.

---

## 7. What I achieved

- ✅ Wrote a three-sentence analysis for 5 LangGraph tickets
- ✅ Used Claude as a **reviewer**, not as the writer of my analyses
- ✅ Rewrote my weaker analyses (CS-310, CS-313, CS-402) using the feedback
- ✅ Turned the draft questions into short, prioritized question lists
- ✅ Completed a full developer role-play from the first question to the closed ticket
- ✅ Found the root cause by following clues ("it worked before" → "what changed?")
- ✅ Investigated on my own instead of only waiting for the reporter
- ✅ Thought beyond the reported bug and found UAT broken as well

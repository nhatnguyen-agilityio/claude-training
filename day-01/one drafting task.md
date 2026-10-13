# One Drafting Task: Deadline Extension Email

**Goal:** Write an email asking my boss for 3 more days to finish the "Pay by Bank Transfer" feature.

---

## Prompt A

> I want draft an email to send for my boss about the deadline extend because I can't finish it on time, please help me check the below context and help me do it
> I'm a Django developer. I'm building the "Pay by Bank Transfer" feature, due this Friday. The bank's payment API turned out to be more complex than expected, and I need 3 more days. I need to tell my boss.

### Result

- **What I got:** A complete, polite email with a subject line, the reason for the delay, a status section (done / in progress / remaining), a new date (Wednesday, Oct 21), a promise of a Friday update, and an optional fallback (deliver a smaller version on Friday).
- **Extra help:** Tips on the date calculation (working days vs. calendar days), filling in the placeholders, and sending early.
- **Weak points:**
  - The tone was **apologetic** ("Sorry for the change, and thanks for understanding").
  - It was **long** (around 250 words plus notes).
  - Claude had to **guess** things I didn't say: the tone, the length, and whether "3 days" meant working days or calendar days.
  - The work plan for the extra days was vague: it listed status, not a day-by-day plan.

**Why:** The prompt gave good **context** (role, feature, deadline, reason, 3 days) but no **requirements** for the output. Claude filled the gaps with its own defaults.

---

## Prompt B

> Please help me rewrite this email with below requirements
> * Keep the email under 200 words
> * The tone of the email need confident and professional, not apologetic or full of excuses
> * Need clear about previous deadline and the new deadline date
> * Need explain what I will do in the extend time
> * End with a clear result will have

### Result

- **What I got:** A shorter email (about 150 words) that met every requirement:
  - **Under 200 words** ✅
  - **Confident tone:** no apology; the delay is framed as a choice to deliver a reliable integration ✅
  - **Clear dates:** "Original deadline: Friday, October 16" and "New deadline: Wednesday, October 21" shown as separate lines ✅
  - **Plan for the extra time:** a day-by-day list (Mon / Tue / Wed) ✅
  - **Clear result at the end:** "fully tested and ready for production" ✅
- **Remaining work for me:** Replace the bracketed text and check that the daily tasks match my real work.

**Why it worked better:** Each bullet in my prompt was a **specific, checkable requirement** (length, tone, content, ending). Claude didn't have to guess, and I can check the result against the list.

---

## Final Summary

| | Prompt A | Prompt B |
|---|---|---|
| **What I gave** | Context only (who, what, why, how long) | Clear requirements for the output |
| **Length** | ~250 words | ~150 words (limit: 200) |
| **Tone** | Polite but apologetic | Confident and professional |
| **Deadlines** | New date mentioned in the text | Old and new dates shown clearly |
| **Extra-time plan** | General status list | Day-by-day plan |
| **Ending** | Apology and thanks | Clear result to expect |

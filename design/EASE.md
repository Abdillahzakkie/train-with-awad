# Ease of use — the rules a redesigned frame is checked against

Read this with `DIRECTION.md`. `DIRECTION.md` says what the product is; this
file says how little a person has to know to use it.

The visitor is a prospective client reading on a phone or a laptop, deciding
whether to book a free call or buy an ebook. They have not seen the site before.
Every rule below exists because that person hesitates without it.

Where this file and an existing frame disagree, the frame is redrawn.

## Rules a machine checks

`check-ease.mjs` decides these four. A frame that breaks one fails the build.

1. **One primary action per screen.** A phone frame carries at most one
   `.btn.pri`; a desk frame at most two (a header action and one in the body).
   More than that is a screen asking more than one question, and it must be
   split. The one primary action is "Book a free call", except on the ebook
   screens where it is "Buy".
2. **A failure carries its own fix.** Every `.failure` holds one sentence of
   cause in plain words and a `.btn` that performs the recovery. "That payment
   did not go through. Your card was not charged." plus a **Try again** button.
   Never a failure with nothing to press.
3. **An empty state names its action.** Every `.empty` holds a `.btn` that
   starts the thing that fills it. An ebook catalogue with nothing in it offers
   **Get notified**, not "no data".
4. **No internal vocabulary reaches a visitor.** These words never appear in a
   frame's rendered text: `webhook`, `minor units`, `SSG`, `Route Handler`,
   `zod`, `Mongoose`, `idempotency`. A visitor reads about the product, not how
   it is built.

## Rules a reviewer checks

These are taste, and a machine cannot decide them. Read them before redrawing.

5. **Legibility comes before density.** Body text is 16px and hints 14px; a
   price or a heading is larger. Nothing readable renders below `--tw-fs-sm`
   (14px desk, 14px phone). If a layout only fits by shrinking type below the
   floor, the layout carries too much and you cut content, not type size.

6. **The button says what it does.** Write the consequence into the label.
   "Book a free call" beats "Submit". "Buy for £9.99" beats "Continue". A person
   who reads only the button must still act correctly, because that is what
   people read.

7. **Descriptive link text, never "click here".** A link names its destination:
   "Read the in-person coaching plan". A screen reader reads link text out of
   context, so "learn more" repeated six times names nothing.

8. **Conditions before the instruction.** When a step has a precondition, lead
   with it. "If you train at home, the Train Anywhere ebook covers the kit" reads
   in the order the visitor needs it, not "the ebook covers the kit if you train
   at home".

9. **Every screen has a real empty and a real failure state.** Not as an
   afterthought — drawn with the awkward data the screen will meet: a catalogue
   with one ebook, a contact form mid-error, a checkout that failed. A blank
   screen is a defect.

10. **Status is a word plus a colour.** A coloured dot with no word is a guess,
    and a wrong guess about an order's state is a support ticket.

11. **Touch targets clear 44px**, and focus is visible on every control. The
    site is read on a phone as often as a laptop.

# Update Help/Formula Section to Render Mathematical Formulas Using KaTeX

## Goal

Update the Help/Formula section of the React TypeScript application to render mathematical formulas using KaTeX instead of plain text.

Currently, formulas are stored as plain strings:

```ts
formula: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]'
```

The formulas should render as professional mathematical notation with:

- Fractions
- Superscripts (exponents)
- Parentheses
- Proper mathematical spacing
- Math symbols when needed

---

## Install KaTeX

Install:

```bash
npm install katex
```

Import the KaTeX stylesheet once:

```ts
import "katex/dist/katex.min.css";
```
---

## Store Formulas as LaTeX

Keep the `formula` property as a string, but store LaTeX instead of plain text.

Example:

```ts
interface HelpSection {
  title: string;
  scenario: string;
  inputSteps: string[];
  formula: string;
  sampleResult: string;
}
```

Compound Interest formula:

```ts
formula: String.raw`
A = P\left(1+\frac{r}{n}\right)^{nt}
+ PMT\left[
\frac{
\left(1+\frac{r}{n}\right)^{nt}-1
}{
\frac{r}{n}
}
\right]
`
```

---

## Create Reusable Formula Component

Create:

```
src/components/MathFormula.tsx
```
---

## Render Formula

The Help section should render formulas using:

```tsx
<MathFormula formula={section.formula} />
```

The rendering component should not change when new calculators are added.

Adding a new calculator should only require adding a new LaTeX formula string.

---

## UI Requirements

Formulas should:

- Display as block equations.
- Be centered.
- Be responsive on mobile.
- Support horizontal scrolling for long formulas.
- Match application typography and spacing.
- Support dark mode by inheriting text color.
- Have proper spacing above and below.

---

## Expected Result

The Help section should display textbook-style mathematical equations instead of plain text.

Example:

\[
A=P\left(1+\frac{r}{n}\right)^{nt}
\]

The formula rendering system should remain unchanged as more calculators are added. Only the LaTeX formula strings should be updated.
Update the Help/Formula section of the React TypeScript application to render mathematical formulas using KaTeX instead of plain text.

Goal

Currently, formulas are stored as plain strings, for example:

formula: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]'


This should instead render as professionally typeset mathematical notation with proper:

Fractions
Superscripts (exponents)
Parentheses
Mathematical spacing
Greek/math symbols where applicable

The appearance should be similar to textbook mathematics or ChatGPT's rendered equations.

Requirements
Install and configure KaTeX.
npm install katex react-katex

Import the stylesheet once in the application.
import "katex/dist/katex.min.css";

Replace the formula property type from string to a KaTeX-compatible math string (or keep it as a string but treat it as LaTeX).

Example interface:

interface HelpSection {
  title: string;
  scenario: string;
  inputSteps: string[];
  formula: string;
  sampleResult: string;
}

Render every formula using BlockMath from react-katex.

Example:

import { BlockMath } from "react-katex";

<BlockMath math={section.formula} />

Convert the Compound Interest formula

Instead of:

"A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]"


store it as:

String.raw`
A = P\left(1+\frac{r}{n}\right)^{nt}
+ PMT\left[
\frac{
\left(1+\frac{r}{n}\right)^{nt}-1
}{
\frac{r}{n}
}
\right]
`


This should render as:

A=P(1+rn)nt+PMT[(1+rn)nt−1rn]

Future-proof the implementation

Design the Help section so every calculator can define its formula using LaTeX.

Example:

const helpSections = [
  {
    title: "Compound Interest",
    ...
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
  },
  {
    title: "Mortgage",
    formula: "...LaTeX..."
  },
  {
    title: "BMI",
    formula: "...LaTeX..."
  }
];


The rendering component should not require any changes when new formulas are added—only the LaTeX string should change.

UI Requirements
Center each formula.
Use block display (not inline).
Ensure formulas are responsive on mobile.
Match the application's typography and spacing.
Add appropriate vertical spacing above and below each formula.
Support dark mode by ensuring the formula text inherits the surrounding text color if necessary.
Expected Result

The Help section should display professionally rendered mathematical equations with textbook-quality formatting rather than plain text expressions like (1 + r/n)^(nt).

Example:
The formula

A=P(1+rn)nt+PMT×[(1+rn)nt−1rn]

is used to calculate the future value of an investment or savings account with compound interest and regular deposits.

Here's what each variable means:

A = Final account balance (future value)
P = Initial principal (starting amount)
r = Annual interest rate (as a decimal, e.g. 5% = 0.05)
n = Number of times interest is compounded per year
t = Number of years
PMT = Regular payment (deposit) made each compounding period
How it works

The formula has two parts:

Growth of the initial principal

P(1+rn)nt

This calculates how your starting balance grows through compound interest.
Growth of the regular deposits

PMT×[(1+rn)nt−1rn]

This calculates the future value of all the periodic deposits, assuming each deposit earns compound interest.
Example

Suppose you:

Start with $5,000
Deposit $100 each month
Earn 6% annual interest
Interest is compounded monthly
Save for 10 years

Then:

P=5000
PMT=100
r=0.06
n=12
t=10

Plugging these into the formula gives a future value of about $25,800.

Important note

This version assumes:

Deposits are made at the end of each compounding period (an ordinary annuity).
The payment frequency matches the compounding frequency. For example, monthly deposits with monthly compounding.

If deposits are made at the beginning of each period (an annuity due), you would multiply the PMT portion by an additional factor of:

(1+rn)

to account for each deposit earning one extra period of interest.
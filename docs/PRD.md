# PRODUCT REQUIREMENT DOCUMENT (PRD)
# Project Name: FinCalc Suite (Apple-Themed Offline MBA Financial Calculator)

---

# 1. Executive Summary

## Objective

Build a **production-grade, offline-first Financial Calculator Web Application** for MBA-level financial analysis and everyday personal finance.

The application should replicate the clean, minimal aesthetic of the Apple Calculator while providing professional-grade financial calculation accuracy.

The final production build **must operate entirely offline** with **zero outbound network requests**.

---

# 2. Functional Requirements

The application shall provide the following calculators:

1. Daily Compound Interest Calculator
2. Simple Interest Calculator
3. Mortgage / Home Loan Calculator
4. Time Value of Money (TVM) Solver
5. Compound Annual Growth Rate (CAGR)

Each calculator must preserve user inputs during the session and display properly formatted financial outputs.

---

# 3. Non-Functional Requirements

## Offline-First

The production build must:

- Work without an internet connection.
- Require zero external APIs.
- Require zero CDN resources.
- Use zero Google Fonts.
- Use zero analytics services.
- Use zero remote assets.

Every required asset must be bundled locally.

---

## Precision

All financial calculations must exclusively use **Decimal.js**.

Native JavaScript floating-point arithmetic must never be used for monetary calculations.

Decimal.js shall be configured with:

- Precision = 20
- Rounding = ROUND_HALF_UP

---

## Performance

The application should:

- Load instantly after installation.
- Cache all assets.
- Work as a Progressive Web App (PWA).
- Launch offline after the first visit.

---

# 4. Technology Stack

## Frontend

- React 19+
- Vite
- TypeScript (Strict Mode)

## Styling

- Tailwind CSS
- Apple-inspired Dark Theme

Primary colors:

```
Background : #1c1c1e
Panel      : #2c2c2e
Accent     : #ff9f0a
Text       : #ffffff
Secondary  : #8e8e93
```

---

## Math Engine

- Decimal.js

---

## Testing

- Vitest
- React Testing Library
- Playwright

---

## Offline Support

- vite-plugin-pwa

---

# 5. Project Dependencies

## Runtime

```text
react
react-dom
decimal.js
```

## Development

```text
tailwindcss
postcss
autoprefixer
vite-plugin-pwa
vitest
@playwright/test
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
eslint
typescript-eslint
```

---

# 6. Project Structure

```text
src/
│
├── assets/
│
├── components/
│   ├── layout/
│   └── ui/
│
├── modules/
│   ├── compound/
│   ├── simple/
│   ├── mortgage/
│   ├── tvm/
│   └── cagr/
│
├── hooks/
│
├── types/
│
├── utils/
│   ├── math.ts
│   ├── compound.ts
│   ├── simple.ts
│   ├── mortgage.ts
│   ├── tvm.ts
│   ├── cagr.ts
│   └── __tests__/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

# 7. Calculator Specifications

## 7.1 Daily Compound Interest

### Inputs

- Principal
- Annual Interest Rate
- Compounding Frequency
- Investment Duration
- Recurring Contributions

### Outputs

- Final Balance
- Interest Earned
- Effective Annual Rate (EAR)

---

## 7.2 Simple Interest

### Inputs

- Principal
- Interest Rate
- Time

### Outputs

- Interest
- Total Amount

---

## 7.3 Mortgage Calculator

### Inputs

- Loan Amount
- Interest Rate
- Loan Term
- Property Tax
- Home Insurance

### Outputs

- Monthly Payment
- Principal & Interest
- Total Interest
- Total Cost
- Amortization Schedule

---

## 7.4 Time Value of Money (TVM)

Must solve for:

- PV
- FV
- PMT
- I/Y
- N

Only one unknown variable may be solved at a time.

---

## 7.5 CAGR

### Inputs

- Beginning Value
- Ending Value
- Number of Years

### Outputs

- CAGR %

---

# 8. UI Requirements

The interface should resemble Apple's Calculator.

Requirements:

- Rounded cards
- Rounded buttons
- Large numeric inputs
- Soft shadows
- Dark mode only
- Responsive layout
- Mobile-first design

---

# 9. Progressive Web App

Configure **vite-plugin-pwa** to:

- Cache every application asset.
- Cache build chunks.
- Cache icons.
- Cache manifest.
- Allow installation.
- Work offline after first load.

---

# 10. Testing Requirements

## Unit Tests

Using Vitest:

Test:

- Zero interest
- Negative validation
- Large numbers
- Decimal precision
- Mortgage accuracy
- TVM accuracy
- CAGR accuracy

---

## Component Tests

Using React Testing Library:

Test:

- Form rendering
- User input
- Validation
- Output rendering
- Error states

---

## End-to-End Tests

Using Playwright.

Required tests:

### Offline Launch

Launch browser offline.

Application must still load.

---

### Offline Calculation

Perform calculations without internet.

Results must be correct.

---

### Zero Network Requests

Intercept every request.

Assert:

```ts
expect(requests.length).toBe(0);
```

No outbound requests are allowed after the application is installed.

---

# 11. Development Workflow

The implementation should follow this order.

1. Scaffold Vite + React + TypeScript project.
2. Enable strict TypeScript.
3. Enable ESLint.
4. Install dependencies.
5. Configure Tailwind.
6. Configure Decimal.js.
7. Configure vite-plugin-pwa.
8. Create project folder structure.
9. Build reusable UI components.
10. Implement financial utility functions.
11. Build calculator modules.
12. Write unit tests.
13. Write component tests.
14. Write Playwright offline tests.
15. Build production bundle.
16. Verify offline functionality.
17. Verify zero outbound network requests.
18. Final production review.

---

# 12. Acceptance Criteria

The project is complete only when all of the following are true:

- ✅ React 19 + Vite
- ✅ TypeScript Strict Mode
- ✅ Apple-inspired UI
- ✅ Fully responsive
- ✅ Uses Decimal.js exclusively
- ✅ Five calculator modules implemented
- ✅ All unit tests pass
- ✅ All React Testing Library tests pass
- ✅ All Playwright tests pass
- ✅ Works entirely offline
- ✅ Zero outbound network requests
- ✅ Installable as a PWA
- ✅ No CDN dependencies
- ✅ No Google Fonts
- ✅ No remote assets
- ✅ Production build passes all verification tests

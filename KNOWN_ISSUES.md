# Lumière — Known Issues Log & Operational Notes

This file tracks identified items, browser environment configurations, and isolated integration points.

| Issue ID | Description | Component | Status | Resolution / Justification |
|---|---|---|---|---|
| ISSUE-01 | Playwright default Chromium binary download timeout on constrained networks | Frontend E2E | **Resolved** | Configured `playwright.config.js` to target Google Chrome channel directly (`channel: 'chrome'`) which uses local Chrome binary with zero download overhead. |
| ISSUE-02 | Windows file URI vs backslash discrepancy in `server.js` startup detection | Backend Server | **Resolved** | Updated startup guard in `server.js` to execute server listener whenever `process.env.NODE_ENV !== 'test'`, preventing bypass on Windows environments. |
| ISSUE-03 | Multiple matching elements for "Reservations" and "Duchess Vivienne" in E2E tests | Frontend E2E | **Resolved** | Scoped assertions using role (`getByRole('heading', { name: 'Reservations' })`) and container IDs (`#lookup-result-card`), satisfying Playwright strict mode. |
| NOTE-01 | Payment Gateway Isolation (v1) | Backend & Frontend Checkout | **Documented** | Payment handling is isolated for v1 ("Pay at restaurant / pickup"). The checkout architecture and backend `orderController.js` feature clearly delineated extension hooks for Stripe / Razorpay webhook integration in v2. |

### Current Status: 0 Open Blockers. All 5 Phase Quality Gates 100% Passed.

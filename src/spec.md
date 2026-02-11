# Specification

## Summary
**Goal:** Build a decentralized learning credential app where students manage on-chain skill badges and employers can verify them, using Internet Identity for authentication.

**Planned changes:**
- Add Internet Identity sign-in and role-aware navigation for Student and Employer experiences.
- Implement a single Motoko canister data model with stable storage for Skill NFTs (badge id, owner Principal, skill name, issuer Principal, issue timestamp, optional description/level) plus query methods (list by owner, fetch by id).
- Add canister methods for issuer permission management and minting new badges with authorization checks and clear errors.
- Build Student Portfolio Wallet UI to list/filter badges, view badge details, and generate a shareable verification link/code containing the badge id.
- Build Employer Verification page to verify a badge by id (or shared link) and display existence + issuer/owner/timestamp/skill name, with a clear not-found state.
- Add an issuer/admin UI (restricted to authorized issuers) to mint badges to a provided student Principal with validation and success/error feedback.
- Apply a consistent education/credential visual theme across pages using Tailwind and composed UI components (no blue/purple as primary brand colors).
- Add and reference generated static assets (app mark + badge visuals) from `frontend/public/assets/generated` for header branding and badge thumbnails.

**User-visible outcome:** Users can sign in with Internet Identity, students can view and share their skill badges from a portfolio, employers can verify badges by id/link using canister data, and authorized issuers can mint new badges that appear in student portfolios.

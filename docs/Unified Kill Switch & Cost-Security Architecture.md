# 🛡️ Strategic Mandate: Unified Kill Switch & Cost-Security Architecture

## 1. Context & Objective
Following the "Mapealo Incident" (where a simple logic error caused a $57/day API bill), Keeptrip must implement a multi-layered defense system. The goal is to allow the Founder to manually trigger service degradation levels to protect the project's financial viability during traffic spikes, bot attacks, or logic regressions.

## 2. Core Architectural Principles
- **FSD Compliance:** No feature or widget may import from `pages`.
- **Zero Meta-Cost:** The control plane must use an optimized Firestore listener (1 read per session).
- **Linguistic Hygiene:** 100% English for code, variables, and comments.
- **Fail-Safe Defaults:** If the remote config fails, the app must default to Level 0 (Normal).

## 3. Operational Levels Definition (The Payload)
The Firestore document `system/operational_flags` will control the following state:

| Level | Name | Effect |
| :--- | :--- | :--- |
| **0** | **Normal** | All systems GO. Full interactive maps and search. |
| **1** | **Soft Kill** | Geocoding API OFF. Block new trip creation. Existing maps stay interactive. |
| **2** | **Hard Kill** | Mapbox WebGL OFF. Fallback to `WorldMapSVG`. Search remains OFF. |
| **3** | **Read-Only** | Firebase Writes OFF. Hide all Save/Add/Upload buttons. Maps stay in fallback. |
| **4** | **Blackout** | App Maintenance Mode. `AppRouter` intercepts and shows a static screen. |

---

## 4. Phased Implementation Plan (Controlled Batches)

### BATCH 1: Infrastructure & Security (THE FOUNDATION)
- **PR 0: FSD Refactor.** Move `WorldMapSVG.jsx` from `src/pages/landing/ui/` to `src/shared/ui/components/`. Update all imports.
- **PR 1: Firestore Control Plane.** - Create `useOperationalFlags` hook in `shared/lib/hooks/`.
  - Implement a global singleton listener to `system/operational_flags`.
  - Ensure precedence: `Remote Config > Env Variable > Default (Level 0)`.
- **PR 2: Security Rules.** Update `firestore.rules` to allow `read` for all auth users, but `write` ONLY for the Founder's UID. Update `firestore.rules.test.js`.

### BATCH 2: Command Center (ADMIN UI)
- **PR 3: Admin Dashboard.** Create `src/features/admin-controls/`. 
  - Implement a minimalist UI in `SettingsPage` (visible only to Admin).
  - Add a selector for Levels 0-4 with a mandatory confirmation prompt.
  - Direct write to the `operational_flags` document.

### BATCH 3: Mapbox Shield (LEVELS 1 & 2)
- **PR 4: Geocoding Choke Point.** Modify `mapboxGeocoding.js` to return a safe empty response if `level >= 1`. Disable "Create Trip" FAB/Buttons in the UI.
- **PR 5: WebGL Deactivation.** In `MapaView.jsx` and related components, prevent Mapbox GL initialization if `level >= 2`. Render `WorldMapSVG` as a beautiful branded fallback.

### BATCH 4: Firebase Safeguards (LEVELS 3 & 4)
- **PR 6: Read-Only Implementation.** If `app_readonly_mode` is true, globally disable or hide all mutation triggers (Save, Delete, Upload). Add guards in the repository layer to prevent client-side write attempts.
- **PR 7: Maintenance Blackout.** In `AppRouter.jsx`, intercept the top-level render if `app_maintenance_mode` is true. Show a static "Explorer's Rest" screen.

### BATCH 5: Reliability & Governance
- **PR 8: Automated Cost Audit.** Extend `e2e/cost-security-audit.spec.ts` using Playwright Network Interception to verify:
  - Zero geocoding requests at Level 1+.
  - Zero map tile requests at Level 2+.
  - Zero Firestore write attempts at Level 3.
- **PR 9: Knowledge Base.** Update `docs/AI_AGENT_CONTEXT.md` to include these cost-efficiency policies as a core development rule.

---

## 5. Success Criteria
- [ ] ZERO functional regressions on Level 0.
- [ ] Propagation of level changes to all active clients in < 10 seconds.
- [ ] Automated tests pass for all levels in the matrix.
- [ ] Documented "Emergency Playbook" for the Founder.
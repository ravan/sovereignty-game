# Talk to Expert Modal — Design Document

## Overview

Port the Marketo "Talk to Expert" contact form from the assessment-tool reference
implementation into the sovereignty quiz game. A prominent CTA on the FinalScreen
opens a dark glassmorphism-styled modal that collects contact info and submits it
to Marketo in the background.

## Architecture

### New files

| File | Purpose |
|------|---------|
| `src/hooks/useMarketo.ts` | Marketo Forms2 script loader + programmatic submit |
| `src/components/ContactExpertModal.tsx` | Dark-themed contact form modal |

### Modified files

| File | Change |
|------|--------|
| `src/components/FinalScreen.tsx` | Add CTA button, modal state, hidden Marketo form element |
| `src/App.tsx` | Initialize `useMarketo()`, pass props to FinalScreen |

## Marketo Integration

- Form ID `3793` via `VITE_MARKETO_FORM_ID`
- Munchkin ID `937-DCH-261` via `VITE_MARKETO_MUNCHKIN_ID` (script URL only, no tracking)
- Campaign ID via `VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT` (placeholder until provided)
- Hidden `<form id="mktoForm_3793">` in FinalScreen DOM
- Fire-and-forget submission (no UI blocking)

## Modal Design

### Visual style (dark glass, matching game aesthetic)

- **Overlay:** `fixed inset-0`, `bg-black/60 backdrop-blur-sm`, z-50
- **Container:** `.glass` + `neon-border-cyan`, `rounded-2xl`, `max-w-lg`
- **Header:** `font-orbitron`, "Talk to an Expert", `MessageSquare` icon, `#30ba78`
- **Inputs:** dark bg `rgba(255,255,255,0.08)`, border `rgba(255,255,255,0.2)`,
  white text, green focus ring
- **Buttons:** Cancel = ghost/white border; Submit = green accent
- **Typography:** `font-suse` body, `font-orbitron` headings

### Form fields

1. First Name + Last Name (2-col)
2. Email + Phone (2-col)
3. Company (full width)
4. Country dropdown (full width)
5. State/Province dropdown (conditional: US/Canada)
6. Privacy consent checkbox (required)

### Validation

All fields required. State required only when country is US or Canada.
Privacy consent must be checked.

## FinalScreen Layout

CTA placed between score-submission status and the Rankings/Play Again buttons:

```
[Score display]
[Rank badge]
[Stats grid]
[Answer breakdown]
[Score submitted status]

  [ Talk to an Expert ]     <-- new, full-width, prominent green CTA

  [Rankings]  [Play Again]
```

## Data Flow

1. User clicks "Talk to an Expert" -> modal opens
2. User fills form, clicks "Send Request"
3. Form data mapped to Marketo fields:
   - Email, FirstName, LastName, Phone, Company, Country, State
   - optin, customCampaignInput (campaign ID)
4. `submitMarketoForm()` called (fire-and-forget)
5. Modal closes immediately
6. Brief success text shown on FinalScreen

## Marketo Field Mapping

| Form field | Marketo field |
|------------|---------------|
| firstName | FirstName |
| lastName | LastName |
| email | Email |
| phone | Phone |
| company | Company |
| country | Country |
| state | State |
| optin | optin |
| (env var) | customCampaignInput |

## Environment Variables

```
VITE_MARKETO_MUNCHKIN_ID=937-DCH-261
VITE_MARKETO_FORM_ID=3793
VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT=
```

## Scope exclusions

- No Munchkin tracking
- No i18n (English only)
- No focus trap (basic Escape + backdrop close)
- No "Download PDF" mode (contact mode only)
- No analytics integration

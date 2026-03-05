# Talk to Expert Modal — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Talk to an Expert" Marketo contact form modal to the game-over screen.

**Architecture:** New `useMarketo` hook loads the Marketo Forms2 script and exposes a `submitForm` function. New `ContactExpertModal` component renders a dark-themed form. FinalScreen gets a CTA button that opens the modal, and App.tsx initializes the hook and passes it down.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Marketo Forms2 JS API, Vite env vars.

**Design doc:** `docs/plans/2026-03-05-talk-to-expert-design.md`

**Reference implementation:** `refs/assessment-tool/src/hooks/useMarketo.ts` and `refs/assessment-tool/src/components/ContactExpertModal.tsx`

---

### Task 1: Environment Variables

**Files:**
- Create: `.env`
- Create: `.env.example`

**Step 1: Create `.env.example`**

```
VITE_MARKETO_MUNCHKIN_ID=937-DCH-261
VITE_MARKETO_FORM_ID=3793
VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT=
```

**Step 2: Create `.env`**

Same contents as `.env.example` (`.env` is already gitignored).

**Step 3: Commit**

```bash
git add .env.example
git commit -m "Add Marketo environment variable template"
```

---

### Task 2: useMarketo Hook

**Files:**
- Create: `src/hooks/useMarketo.ts`

**Reference:** `refs/assessment-tool/src/hooks/useMarketo.ts`

**Step 1: Create the hook**

Port the reference hook with these changes:
- Remove `MARKETO_CAMPAIGNS` export (not needed — campaign ID passed at call site)
- Remove `splitName` utility (not needed — form has separate first/last fields)
- Keep the same `MarketoFormData` interface
- Keep the same `MarketoFormInstance` and `MktoForms2` type declarations
- Keep the same `MARKETO_FORM_ID` export (needed for hidden form element)
- Keep the full `useMarketo()` hook logic: script loading, form initialization, `submitForm` with timeout

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

const getMarketoConfig = () => {
  const munchkinId = import.meta.env.VITE_MARKETO_MUNCHKIN_ID || '937-DCH-261';
  const formId = parseInt(import.meta.env.VITE_MARKETO_FORM_ID || '3793', 10);
  return {
    scriptUrl: `//${munchkinId}.mktoweb.com/js/forms2/js/forms2.min.js`,
    baseUrl: `//${munchkinId}.mktoweb.com`,
    munchkinId,
    formId,
  };
};

const MARKETO_CONFIG = getMarketoConfig();

export const MARKETO_FORM_ID = MARKETO_CONFIG.formId;

export interface MarketoFormData {
  Email?: string;
  FirstName?: string;
  LastName?: string;
  Phone?: string;
  Company?: string;
  Country?: string;
  State?: string;
  optin?: boolean;
  customCampaignInput?: string;
}

interface MarketoFormInstance {
  setValues: (values: Record<string, unknown>) => MarketoFormInstance;
  getValues: () => Record<string, unknown>;
  submit: () => MarketoFormInstance;
  onSuccess: (
    callback: (values: Record<string, unknown>, followUpUrl: string) => boolean
  ) => MarketoFormInstance;
  onSubmit: (callback: (form: MarketoFormInstance) => void) => MarketoFormInstance;
  validate: () => boolean;
  submittable: (canSubmit: boolean) => MarketoFormInstance;
}

interface MktoForms2 {
  loadForm: (
    baseUrl: string,
    munchkinId: string,
    formId: number,
    callback?: (form: MarketoFormInstance) => void
  ) => void;
}

declare global {
  interface Window {
    MktoForms2?: MktoForms2;
  }
}

export interface UseMarketoResult {
  isReady: boolean;
  submitForm: (data: MarketoFormData) => Promise<boolean>;
}

export function useMarketo(): UseMarketoResult {
  const [isReady, setIsReady] = useState(false);
  const formInstanceRef = useRef<MarketoFormInstance | null>(null);
  const scriptLoadedRef = useRef(false);
  const submitResolverRef = useRef<((success: boolean) => void) | null>(null);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    if (window.MktoForms2) {
      initializeForm();
      return;
    }

    const existingScript = document.querySelector('script[src*="forms2.min.js"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.MktoForms2) {
          clearInterval(checkInterval);
          initializeForm();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = MARKETO_CONFIG.scriptUrl;
    script.async = true;
    script.onload = () => initializeForm();
    script.onerror = () => console.error('[Marketo] Failed to load Forms2 script');
    document.head.appendChild(script);

    function initializeForm() {
      if (!window.MktoForms2) return;

      window.MktoForms2.loadForm(
        MARKETO_CONFIG.baseUrl,
        MARKETO_CONFIG.munchkinId,
        MARKETO_CONFIG.formId,
        (form) => {
          formInstanceRef.current = form;

          form.onSuccess(() => {
            if (submitResolverRef.current) {
              submitResolverRef.current(true);
              submitResolverRef.current = null;
            }
            return false;
          });

          setIsReady(true);
        }
      );
    }
  }, []);

  const submitForm = useCallback(
    async (data: MarketoFormData): Promise<boolean> => {
      if (!formInstanceRef.current) return false;

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          submitResolverRef.current = null;
          resolve(false);
        }, 10000);

        submitResolverRef.current = (success) => {
          clearTimeout(timeout);
          resolve(success);
        };

        try {
          const filteredData = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
          );
          formInstanceRef.current!.setValues(filteredData);

          const isValid = formInstanceRef.current!.validate();
          if (!isValid) {
            formInstanceRef.current!.submittable(true);
          }

          formInstanceRef.current!.submit();
        } catch (error) {
          console.error('[Marketo] Error during submission:', error);
          clearTimeout(timeout);
          submitResolverRef.current = null;
          resolve(false);
        }
      });
    },
    []
  );

  return { isReady, submitForm };
}
```

**Step 2: Commit**

```bash
git add src/hooks/useMarketo.ts
git commit -m "Add useMarketo hook for Forms2 integration"
```

---

### Task 3: ContactExpertModal Component

**Files:**
- Create: `src/components/ContactExpertModal.tsx`

**Reference:** `refs/assessment-tool/src/components/ContactExpertModal.tsx`

**Step 1: Create the modal component**

Port the reference modal with these changes:
- Remove i18n (`useTranslation`) — use hardcoded English strings
- Remove `useFocusTrap` — basic Escape + backdrop close only
- Remove `mode` prop — contact mode only, no download mode
- Remove `isSubmitting` prop — fire-and-forget, modal closes immediately
- **Restyle entirely** for dark glass theme:
  - Overlay: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`
  - Container: `glass rounded-2xl neon-border-cyan max-w-lg w-full max-h-[90vh] overflow-hidden`
  - Header: dark with `font-orbitron` heading, `#30ba78` color, `MessageSquare` icon
  - Inputs: `bg-white/[0.08] border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#30ba78] focus:ring-1 focus:ring-[#30ba78]`
  - Labels: `text-sm font-medium text-white/80`
  - Select elements: same dark styling as inputs
  - Cancel button: ghost style `border border-white/30 text-white hover:bg-white/10`
  - Submit button: green accent `bg-[#30ba78]/20 border border-[#30ba78]/50 text-[#30ba78] hover:bg-[#30ba78]/30`
  - Required asterisks: `text-[#fe7c3f]` (game's orange/red accent)
- Keep: same form fields, country/state lists, validation logic, Escape key handler, form reset on close

Export the `ContactFormData` interface:

```typescript
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  state: string;
  optin: boolean;
}
```

The component signature:

```typescript
interface ContactExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
}

export function ContactExpertModal({ isOpen, onClose, onSubmit }: ContactExpertModalProps)
```

Full countries list and US states / Canada provinces — copy verbatim from `refs/assessment-tool/src/components/ContactExpertModal.tsx`.

**Step 2: Commit**

```bash
git add src/components/ContactExpertModal.tsx
git commit -m "Add dark-themed ContactExpertModal component"
```

---

### Task 4: Integrate into FinalScreen

**Files:**
- Modify: `src/components/FinalScreen.tsx`

**Step 1: Update FinalScreen props**

Add Marketo-related props to `FinalScreenProps`:

```typescript
interface FinalScreenProps {
  state: GameState;
  questions: Question[];
  correctCount: number;
  onLeaderboard: () => void;
  onPlayAgain: () => void;
  isMarketoReady: boolean;
  submitMarketoForm: (data: MarketoFormData) => Promise<boolean>;
}
```

Add imports:

```typescript
import { MessageSquare } from 'lucide-react';
import { ContactExpertModal, ContactFormData } from './ContactExpertModal';
import { MarketoFormData, MARKETO_FORM_ID } from '../hooks/useMarketo';
```

**Step 2: Add modal state and handlers**

Inside the `FinalScreen` component, add:

```typescript
const [showContactModal, setShowContactModal] = useState(false);
const [contactSubmitted, setContactSubmitted] = useState(false);

const handleContactSubmit = (data: ContactFormData) => {
  setShowContactModal(false);
  setContactSubmitted(true);

  if (isMarketoReady) {
    const marketoData: MarketoFormData = {
      Email: data.email,
      FirstName: data.firstName,
      LastName: data.lastName,
      Phone: data.phone,
      Company: data.company,
      Country: data.country,
      State: data.state || undefined,
      optin: data.optin,
      customCampaignInput: import.meta.env.VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT || undefined,
    };
    submitMarketoForm(marketoData).then((success) => {
      console.log('[Marketo]', success ? 'submitted' : 'failed');
    });
  }
};
```

**Step 3: Add CTA button and modal to JSX**

Between the `{submitted && ...}` block (line ~213) and the `{/* Actions */}` comment (line ~215), add:

```tsx
{/* Talk to Expert CTA */}
{!contactSubmitted ? (
  <button
    onClick={() => setShowContactModal(true)}
    className="w-full py-3.5 rounded-xl font-orbitron text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
    style={{
      background: 'rgba(48,186,120,0.15)',
      border: '2px solid rgba(48,186,120,0.5)',
      color: '#30ba78',
    }}
  >
    <MessageSquare className="w-5 h-5" />
    Talk to an Expert
  </button>
) : (
  <p className="font-orbitron text-xs tracking-widest" style={{ color: '#30ba78' }}>
    ✓ Request Sent
  </p>
)}
```

At the end of the JSX (before the closing `</div>`), add the modal and hidden Marketo form:

```tsx
<ContactExpertModal
  isOpen={showContactModal}
  onClose={() => setShowContactModal(false)}
  onSubmit={handleContactSubmit}
/>

{/* Hidden Marketo form element */}
<div style={{ display: 'none' }} aria-hidden="true">
  <form id={`mktoForm_${MARKETO_FORM_ID}`}></form>
</div>
```

**Step 4: Commit**

```bash
git add src/components/FinalScreen.tsx
git commit -m "Add Talk to Expert CTA and modal to FinalScreen"
```

---

### Task 5: Wire Up in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Initialize useMarketo and pass props**

Add import:

```typescript
import { useMarketo } from './hooks/useMarketo';
```

Inside `App()`, add after `useGame()`:

```typescript
const { isReady: isMarketoReady, submitForm: submitMarketoForm } = useMarketo();
```

Update the FinalScreen render to pass new props:

```tsx
{state.phase === 'final' && (
  <FinalScreen
    state={state}
    questions={questions}
    correctCount={correctCount}
    onLeaderboard={showLeaderboard}
    onPlayAgain={resetGame}
    isMarketoReady={isMarketoReady}
    submitMarketoForm={submitMarketoForm}
  />
)}
```

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "Wire useMarketo into App and pass to FinalScreen"
```

---

### Task 6: Visual QA with Playwright

**Step 1: Start dev server and visually verify**

```bash
npm run dev
```

Use the playwright-skill to:
1. Navigate to the game
2. Enter a name and play through (or manually set game state to final)
3. Screenshot the FinalScreen — verify CTA button placement and styling
4. Click "Talk to an Expert" — screenshot the modal
5. Verify dark glass theme, form fields, country dropdown
6. Select "United States" — verify state dropdown appears
7. Fill form, verify submit button enables when all fields + consent filled
8. Submit and verify "Request Sent" text replaces the CTA button

**Step 2: Fix any visual issues found**

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "Fix visual issues from QA"
```

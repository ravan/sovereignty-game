# Marketo Campaign Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Marketo campaign names for "Talk to an Expert" and "Self-Assessment" requests.

**Architecture:** Direct updates to hardcoded fallbacks in components and example environment variables, with improved type safety for the environment variables.

**Tech Stack:** React, TypeScript, Vite.

---

### Task 1: Update Environment Variable Types

**Files:**
- Modify: `src/vite-env.d.ts`

- [ ] **Step 1: Add campaign environment variables to `ImportMetaEnv`**

```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_MARKETO_MUNCHKIN_ID?: string;
  readonly VITE_MARKETO_FORM_ID?: string;
  readonly VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT?: string;
  readonly VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/vite-env.d.ts
git commit -m "chore: add Marketo campaign env types"
```

---

### Task 2: Update FinalScreen Fallbacks

**Files:**
- Modify: `src/components/FinalScreen.tsx`

- [ ] **Step 1: Update `handleContactSubmit` fallback**

Change from `0014674_Digital_Sovereignty_Quiz_Talk_to_an_Expert` to `0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert`.

```typescript
  const handleContactSubmit = (data: ContactFormData) => {
    setShowContactModal(false);
    setContactSubmitted(true);
    submitToMarketo(data, import.meta.env.VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT || '0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert');
  };
```

- [ ] **Step 2: Verify `handleSelfAssessmentSubmit` fallback**

Ensure it is `0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request`.

```typescript
  const handleSelfAssessmentSubmit = (data: ContactFormData) => {
    setShowSelfAssessmentModal(false);
    setSelfAssessmentSubmitted(true);
    submitToMarketo(data, import.meta.env.VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT || '0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request');
  };
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FinalScreen.tsx
git commit -m "feat: update Marketo campaign fallbacks in FinalScreen"
```

---

### Task 3: Update .env.example

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Update default campaign values**

```text
VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT=0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert
VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT=0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: update Marketo campaign defaults in .env.example"
```

---

### Task 4: Verification

- [ ] **Step 1: Run TypeScript compiler to verify types**

Run: `npm run type-check` (or `tsc --noEmit`)
Expected: No errors related to `import.meta.env`.

- [ ] **Step 2: Manual code review of the changes**

Verify all hardcoded strings match the user's request.
Sales Call: `0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert`
Self-Assessment: `0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request`

# Design Document: Update Marketo Campaign Names

**Date:** 2026-03-27
**Status:** Approved

## Goal
Update the Marketo campaign names for the "Talk to an Expert" and "Self-Assessment" requests to match the provided campaign values from the user.

## Requirements
- Update the campaign name for "Sales Call Request" to `0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert`.
- Ensure the campaign name for "Web Landing Page" is `0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request`.
- Update the environment variables in the code and `.env.example`.
- Ensure proper type definitions for the environment variables in `src/vite-env.d.ts`.

## Changes

### 1. `src/components/FinalScreen.tsx`
- Update the hardcoded fallback for `VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT` to `0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert`.
- Verify the fallback for `VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT` is `0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request`.

### 2. `.env.example`
- Update the default value for `VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT` to `0014687_Digital_Sovereignty_Quiz_Talk_to_an_Expert`.
- Verify the value for `VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT` is `0014677_Digital_Sovereignty_Quiz_Sovereignty_Framework_Self-Assessment_Request`.

### 3. `src/vite-env.d.ts`
- Add the following properties to the `ImportMetaEnv` interface:
  - `VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT: string;`
  - `VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT: string;`

## Testing
- Verify that the campaign names are correctly used in `FinalScreen.tsx` when the environment variables are not set.
- Verify that the new types are correctly recognized by the TypeScript compiler.

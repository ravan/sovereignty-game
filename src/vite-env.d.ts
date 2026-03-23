/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_MARKETO_MUNCHKIN_ID?: string;
  readonly VITE_MARKETO_FORM_ID?: string;
  readonly VITE_MARKETO_CAMPAIGN_TALK_TO_EXPERT?: string;
  readonly VITE_MARKETO_CAMPAIGN_SELF_ASSESSMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

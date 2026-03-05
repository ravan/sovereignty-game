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

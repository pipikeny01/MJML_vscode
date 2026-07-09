import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ExportedTemplate } from '../composables/useMjmlEditor';

const TEMPLATE_STORAGE_KEY = 'c21-mjml-template-library';

export interface TemplateSavePayload {
  name: string;
  purpose: string;
  note: string;
  tags: string[];
}

export interface StoredTemplate extends ExportedTemplate {
  id: string;
  name: string;
  purpose: string;
  note: string;
  tags: string[];
  updatedAt: string;
}

export const useTemplateStore = defineStore('template', () => {
  const lastSavedTemplate = ref<ExportedTemplate>();
  const templates = ref<StoredTemplate[]>([]);
  const isSaving = ref(false);

  function loadTemplatesFromLocalStorage() {
    const raw = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);

    if (!raw) {
      templates.value = [];
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Array<Partial<StoredTemplate>>;
      templates.value = parsed
        .filter((item) => typeof item?.mjml === 'string' && typeof item?.html === 'string')
        .map((item) => ({
          id: String(item.id ?? window.crypto?.randomUUID?.() ?? `${Date.now()}`),
          name: String(item.name ?? '未命名範本'),
          purpose: String(item.purpose ?? '一般'),
          note: String(item.note ?? ''),
          tags: Array.isArray(item.tags) ? item.tags.map((tag) => String(tag)) : [],
          mjml: String(item.mjml),
          html: String(item.html),
          updatedAt: String(item.updatedAt ?? new Date().toISOString()),
        }));
    } catch {
      templates.value = [];
    }
  }

  function persistTemplates() {
    window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates.value));
  }

  async function saveTemplateToLocalStorage(template: ExportedTemplate, payload: TemplateSavePayload) {
    isSaving.value = true;

    await new Promise((resolve) => window.setTimeout(resolve, 420));

    const saved: StoredTemplate = {
      id: window.crypto?.randomUUID?.() ?? `${Date.now()}`,
      name: payload.name,
      purpose: payload.purpose,
      note: payload.note,
      tags: payload.tags,
      mjml: template.mjml,
      html: template.html,
      updatedAt: new Date().toISOString(),
    };

    lastSavedTemplate.value = template;
    templates.value = [saved, ...templates.value].slice(0, 30);
    persistTemplates();

    console.log('[MJML Template Saved to localStorage]', saved.name, saved.mjml);
    isSaving.value = false;
  }

  loadTemplatesFromLocalStorage();

  return {
    lastSavedTemplate,
    templates,
    isSaving,
    loadTemplatesFromLocalStorage,
    saveTemplateToLocalStorage,
  };
});
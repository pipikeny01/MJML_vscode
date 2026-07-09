<template>
  <EditorToolbar
    :disabled="!isReady"
    :saving="templateStore.isSaving"
    @new-template="openTemplateDialog"
    @save="openSaveDialog"
    @preview="openPreview"
  />

  <v-main class="editor-main">
    <div class="editor-layout">
      <PropertyTokenPanel :disabled="!isReady" @insert="handleInsertToken" />
      <MjmlEditorCanvas @ready="initEditor" />
    </div>
  </v-main>

  <TemplatePreviewDialog v-model="isPreviewOpen" :mjml="preview.mjml" :preview-html="preview.html" />

  <v-dialog v-model="isTemplateDialogOpen" max-width="700">
    <v-card class="preview-dialog">
      <v-card-title class="preview-title">新增範本</v-card-title>
      <v-card-text>
        <div class="template-picker-grid">
          <v-radio-group v-model="selectedTemplateId" class="mb-0 template-option-list">
            <v-radio v-for="item in templateOptions" :key="item.id" :value="item.id">
              <template #label>
                <div class="template-option-item">
                  <p>{{ item.label }}</p>
                  <span v-if="item.purpose">用途：{{ item.purpose }}</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <div class="template-preview-panel">
            <p class="template-preview-title">範本預覽</p>
            <iframe v-if="templateSelectionPreview.html" class="template-mini-preview" :srcdoc="templateSelectionPreview.html" />
            <div v-else class="template-preview-empty">此範本無預覽內容，建立後可在畫布直接編修。</div>
            <div class="template-preview-meta">
              <v-chip v-for="tag in templateSelectionPreview.tags" :key="tag" size="small" variant="outlined">{{ tag }}</v-chip>
            </div>
            <p v-if="templateSelectionPreview.note" class="template-preview-note">{{ templateSelectionPreview.note }}</p>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isTemplateDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="applySelectedTemplate">建立</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="isSaveDialogOpen" max-width="620">
    <v-card class="preview-dialog">
      <v-card-title class="preview-title">儲存範本資訊</v-card-title>
      <v-card-text>
        <div class="save-form-grid">
          <v-text-field v-model="saveForm.name" label="範本名稱" variant="outlined" density="comfortable" />
          <v-select v-model="saveForm.purpose" :items="templatePurposeOptions" label="用途分類" variant="outlined" density="comfortable" />
          <v-text-field
            v-model="saveForm.tagsInput"
            label="標籤（用逗號分隔，例如 廣告, 祝賀, 春節）"
            variant="outlined"
            density="comfortable"
          />
          <v-textarea
            v-model="saveForm.note"
            rows="3"
            auto-grow
            label="備註"
            variant="outlined"
            density="comfortable"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="isSaveDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" :loading="templateStore.isSaving" @click="confirmSaveTemplate">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="bottom right" timeout="2600">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import EditorToolbar from '../components/EditorToolbar.vue';
import MjmlEditorCanvas from '../components/MjmlEditorCanvas.vue';
import PropertyTokenPanel from '../components/PropertyTokenPanel.vue';
import TemplatePreviewDialog from '../components/TemplatePreviewDialog.vue';
import {
  BLANK_MJML_TEMPLATE,
  DEFAULT_MJML_TEMPLATE,
  useMjmlEditor,
  type ExportedTemplate,
} from '../composables/useMjmlEditor';
import { useTemplateStore } from '../stores/templateStore';

const templateStore = useTemplateStore();
const { initEditor, insertToken, loadTemplate, exportTemplate, destroyEditor, isReady } = useMjmlEditor();

const isPreviewOpen = ref(false);
const isTemplateDialogOpen = ref(false);
const isSaveDialogOpen = ref(false);
const preview = reactive<ExportedTemplate>({ mjml: '', html: '' });
const selectedTemplateId = ref('preset-default');
const saveForm = reactive({
  name: `新範本-${new Date().toLocaleDateString('zh-TW')}`,
  purpose: '廣告用',
  tagsInput: '',
  note: '',
});
const snackbar = reactive({
  visible: false,
  message: '',
  color: 'primary',
});

const templatePurposeOptions = ['廣告用', '祝賀用', '通知用', '活動用', '其他'];

const templateOptions = computed(() => {
  const systemOptions = [
    {
      id: 'preset-default',
      name: '房仲預設範本',
      label: '房仲預設範本（含標題、地址、總價區塊）',
      mjml: DEFAULT_MJML_TEMPLATE,
      html: '',
      purpose: '系統範本',
      note: '適合快速建立一般物件 EDM',
      tags: ['系統', '預設'],
    },
    {
      id: 'preset-blank',
      name: '空白範本',
      label: '完全空白（只保留 <mj-body>）',
      mjml: BLANK_MJML_TEMPLATE,
      html: '',
      purpose: '系統範本',
      note: '完全自行排版',
      tags: ['系統', '空白'],
    },
  ];

  const savedOptions = templateStore.templates.map((item) => ({
    id: item.id,
    name: item.name,
    label: `${item.name} (${new Date(item.updatedAt).toLocaleString('zh-TW')})`,
    mjml: item.mjml,
    html: item.html,
    purpose: item.purpose,
    note: item.note,
    tags: item.tags,
  }));

  return [...systemOptions, ...savedOptions];
});

const templateSelectionPreview = computed(() => {
  const selected = templateOptions.value.find((item) => item.id === selectedTemplateId.value);

  if (!selected) {
    return { html: '', note: '', tags: [] as string[] };
  }

  return {
    html: selected.html,
    note: selected.note,
    tags: selected.tags,
  };
});

function showMessage(message: string, color = 'primary') {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.visible = true;
}

function handleInsertToken(token: string) {
  if (!insertToken(token)) {
    showMessage('請先點擊畫布上的文字區塊，再插入參數', 'warning');
    return;
  }

  showMessage(`已插入 ${token}`);
}

function openSaveDialog() {
  isSaveDialogOpen.value = true;
}

async function confirmSaveTemplate() {
  const exported = exportTemplate();
  const tags = saveForm.tagsInput
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  await templateStore.saveTemplateToLocalStorage(exported, {
    name: saveForm.name.trim() || '未命名範本',
    purpose: saveForm.purpose,
    note: saveForm.note.trim(),
    tags,
  });

  isSaveDialogOpen.value = false;
  showMessage('範本已儲存至 localStorage');
}

function openPreview() {
  const exported = exportTemplate();

  preview.mjml = exported.mjml;
  preview.html = exported.html;
  isPreviewOpen.value = true;
}

function openTemplateDialog() {
  templateStore.loadTemplatesFromLocalStorage();
  selectedTemplateId.value = templateOptions.value[0]?.id ?? 'preset-default';
  isTemplateDialogOpen.value = true;
}

function applySelectedTemplate() {
  const target = templateOptions.value.find((item) => item.id === selectedTemplateId.value);

  if (!target || !loadTemplate(target.mjml)) {
    showMessage('範本載入失敗，請稍後再試', 'error');
    return;
  }

  saveForm.name = target.name;
  saveForm.purpose = target.purpose;
  saveForm.note = target.note;
  saveForm.tagsInput = target.tags.join(', ');

  isTemplateDialogOpen.value = false;
  showMessage('已建立新範本內容');
}

onBeforeUnmount(() => {
  destroyEditor();
});
</script>
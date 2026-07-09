<template>
  <v-app-bar class="editor-toolbar" height="72" flat>
    <div class="toolbar-brand">
      <div class="brand-mark">21</div>
      <div>
        <p class="brand-kicker">Real Estate EDM Builder</p>
        <h1> MJML 樣板編輯器</h1>
      </div>
    </div>

    <v-spacer />

    <div class="toolbar-actions">
      <v-btn color="secondary" variant="outlined" :disabled="disabled" @click="$emit('new-template')">
        <template #prepend>
          <FilePlus2 :size="18" />
        </template>
        新增範本
      </v-btn>
      <v-btn color="secondary" variant="tonal" :disabled="disabled" @click="$emit('preview')">
        <template #prepend>
          <Eye :size="18" />
        </template>
        輸出為圖片/預覽
      </v-btn>
      <v-btn color="primary" variant="flat" :loading="saving" :disabled="disabled" @click="$emit('save')">
        <template #prepend>
          <Save :size="18" />
        </template>
        儲存共用樣板
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { Eye, FilePlus2, Save } from '@lucide/vue';

defineProps<{
  disabled?: boolean;
  saving?: boolean;
}>();

defineEmits<{
  'new-template': [];
  save: [];
  preview: [];
}>();
</script>
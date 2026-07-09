<template>
  <v-dialog :model-value="modelValue" max-width="1120" @update:model-value="$emit('update:modelValue', $event)">
    <v-card class="preview-dialog">
      <v-card-title class="preview-title">
        <span>樣板預覽</span>
        <v-btn icon variant="text" aria-label="關閉預覽" @click="$emit('update:modelValue', false)">
          <X :size="20" />
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div class="preview-grid">
          <div class="preview-frame-wrap">
            <iframe title="MJML HTML Preview" class="preview-frame" :srcdoc="previewHtml" />
          </div>
          <pre class="preview-code"><code>{{ mjml }}</code></pre>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue';

withDefaults(
  defineProps<{
    modelValue: boolean;
    mjml?: string;
    previewHtml?: string;
  }>(),
  {
    mjml: '',
    previewHtml: '',
  },
);

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
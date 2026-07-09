<template>
  <aside class="token-panel">
    <div class="panel-heading">
      <p>資料參數</p>
      <span>插入至已選取文字區塊</span>
    </div>

    <v-btn
      v-for="token in tokens"
      :key="token.value"
      class="token-button"
      color="primary"
      variant="tonal"
      size="small"
      :title="token.title"
      :disabled="disabled"
      @click="$emit('insert', token.value)"
    >
      <template #prepend>
        <Braces :size="14" />
      </template>
      {{ token.label }}
    </v-btn>
  </aside>
</template>

<script setup lang="ts">
import { Braces } from '@lucide/vue';

defineProps<{
  disabled?: boolean;
}>();

defineEmits<{
  insert: [token: string];
}>();

const tokens = [
  { title: '物件名稱', label: '{ObjectName}', value: '{ObjectName}' },
  { title: '物件地址', label: '{ObjectAddress}', value: '{ObjectAddress}' },
  { title: '總價', label: '{SellTotalPrice}', value: '{SellTotalPrice}' },
];
</script>
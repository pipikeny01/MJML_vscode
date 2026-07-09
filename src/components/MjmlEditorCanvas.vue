<template>
  <section class="canvas-shell">
    <div class="canvas-topline">
      <span>MJML Mode</span>
      <strong>GrapesJS 畫布</strong>
    </div>
    <div ref="editorElement" class="gjs-host" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{
  ready: [element: HTMLElement];
}>();

const editorElement = ref<HTMLElement>();

onMounted(() => {
  if (editorElement.value) {
    emit('ready', editorElement.value);
  }
});
</script>
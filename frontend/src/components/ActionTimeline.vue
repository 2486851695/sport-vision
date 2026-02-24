<template>
  <div class="action-timeline">
    <h3 class="timeline-title">⚡ 动作时间线</h3>
    <div class="timeline-container" ref="containerRef">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="timeline-item"
        :style="{
          borderColor: item.color,
          color: item.color,
          background: item.color + '15',
        }"
      >
        {{ item.icon }} {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ action: Object })
const items = ref([])
const containerRef = ref(null)

watch(() => props.action, (val) => {
  if (val && val.is_new_action) {
    const info = val.action_info
    items.value.push({
      icon: info.icon,
      name: info.name,
      color: info.color,
    })
    nextTick(() => {
      if (containerRef.value) {
        containerRef.value.scrollLeft = containerRef.value.scrollWidth
      }
    })
  }
})
</script>

<style scoped>
.action-timeline {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  backdrop-filter: blur(10px);
  max-height: 120px;
}

.timeline-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.timeline-container {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border-subtle) transparent;
}

.timeline-item {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid var(--border-subtle);
  animation: popIn 0.3s ease;
}
</style>

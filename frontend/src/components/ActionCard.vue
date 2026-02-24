<template>
  <div class="data-card action-card" :style="{ borderColor: color }">
    <div class="card-header">当前动作</div>
    <div class="action-display">
      <span class="action-icon">{{ icon }}</span>
      <span class="action-name" :style="{ color }">{{ name }}</span>
    </div>
    <div class="action-confidence">
      <div class="confidence-bar">
        <div class="confidence-fill" :style="{ width: pct + '%' }"></div>
      </div>
      <span class="confidence-text">{{ pct }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ action: Object })

const info = computed(() => props.action?.action_info || { icon: '🧍', name: '准备 Ready', color: '#888888' })
const icon = computed(() => info.value.icon)
const name = computed(() => info.value.name)
const color = computed(() => info.value.color)
const pct = computed(() => Math.round((props.action?.confidence || 0.5) * 100))
</script>

<style scoped>
.data-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  backdrop-filter: blur(10px);
  transition: border-color var(--transition-normal);
}

.action-card { border-width: 1px; }

.card-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-display {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.action-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4));
  transition: all var(--transition-normal);
}

.action-name {
  font-size: 1.2rem;
  font-weight: 700;
  transition: color var(--transition-normal);
}

.action-confidence {
  display: flex;
  align-items: center;
  gap: 10px;
}

.confidence-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-green));
  border-radius: 3px;
  transition: width var(--transition-fast);
}

.confidence-text {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--accent-cyan);
  min-width: 36px;
}
</style>

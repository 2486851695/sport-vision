<template>
  <div class="data-card">
    <div class="card-header">📊 动作统计</div>
    <div class="stats-grid">
      <div v-for="s in items" :key="s.key" class="stat-item">
        <span class="stat-icon">{{ s.icon }}</span>
        <div class="stat-info">
          <span class="stat-info-label">{{ s.label }}</span>
          <span class="stat-info-count">{{ s.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ actionCounts: Object })

const ACTION_META = [
  { key: 'serve', icon: '🎯', label: '发球' },
  { key: 'forehand', icon: '➡️', label: '正手' },
  { key: 'backhand', icon: '⬅️', label: '反手' },
  { key: 'lob', icon: '🌈', label: '高吊' },
]

const items = computed(() => {
  const counts = props.actionCounts || {}
  return ACTION_META.map(m => ({
    ...m,
    count: counts[m.key] || 0,
  }))
})
</script>

<style scoped>
.data-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  backdrop-filter: blur(10px);
}

.data-card:hover { border-color: var(--border-glow); }

.card-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.stat-icon { font-size: 1rem; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-info-label {
  font-size: 0.65rem;
  color: var(--text-dim);
}

.stat-info-count {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}
</style>

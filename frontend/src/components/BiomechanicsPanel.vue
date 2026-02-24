<template>
  <div class="data-card">
    <div class="card-header">📐 运动力学</div>
    <div class="bio-stats">
      <div v-for="s in stats" :key="s.key" class="stat-row">
        <span class="stat-label">{{ s.label }}</span>
        <div class="stat-bar-container">
          <div class="stat-bar" :style="{ width: s.pct + '%', '--bar-color': s.color }"></div>
        </div>
        <span class="stat-value">{{ s.display }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ biomechanics: Object })

const stats = computed(() => {
  const bio = props.biomechanics || {}
  return [
    {
      key: 'wrist_speed',
      label: '手腕速度',
      pct: Math.min(100, ((bio.wrist_speed || 0) / 50) * 100),
      display: (bio.wrist_speed || 0).toFixed(1),
      color: 'var(--accent-cyan)',
    },
    {
      key: 'body_lean',
      label: '身体倾斜',
      pct: Math.min(100, ((bio.body_lean || 0) / 45) * 100),
      display: (bio.body_lean || 0).toFixed(1) + '°',
      color: '#ffaa33',
    },
    {
      key: 'knee_bend',
      label: '膝盖弯曲',
      pct: Math.min(100, ((bio.knee_bend || 0) / 90) * 100),
      display: (bio.knee_bend || 0).toFixed(1) + '°',
      color: '#aa66ff',
    },
    {
      key: 'symmetry',
      label: '对称性',
      pct: Math.min(100, bio.symmetry_score || 0),
      display: (bio.symmetry_score || 0).toFixed(0) + '%',
      color: '#33ff88',
    },
  ]
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

.bio-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: grid;
  grid-template-columns: 70px 1fr 50px;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.stat-bar-container {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  width: 0%;
  background: var(--bar-color, var(--accent-cyan));
  border-radius: 3px;
  transition: width var(--transition-fast);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-primary);
  text-align: right;
}
</style>

<template>
  <div class="demo-selector">
    <h3 class="demo-title">选择 Demo 视频</h3>
    <div class="demo-grid">
      <div
        v-if="demos.length === 0"
        class="demo-empty"
      >
        <p>暂无 Demo 视频</p>
        <p class="demo-hint">将 .mp4 文件放入 <code>demo_videos/</code> 目录</p>
      </div>
      <div
        v-for="demo in demos"
        :key="demo.id"
        class="demo-card"
        @click="$emit('select', demo)"
      >
        <div class="demo-card-name">🎬 {{ demo.name }}</div>
        <div class="demo-card-size">{{ demo.size_mb }} MB</div>
      </div>
    </div>
    <p class="demo-hint">💡 将视频文件放入 <code>demo_videos/</code> 目录即可添加 Demo</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['select'])
const demos = ref([])

onMounted(async () => {
  try {
    const resp = await fetch('/api/demos')
    const data = await resp.json()
    demos.value = data.demos || []
  } catch (err) {
    console.warn('Failed to load demos:', err)
  }
})
</script>

<style scoped>
.demo-selector {
  margin-top: 24px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  animation: fadeUp 0.4s ease;
}

.demo-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.demo-empty {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--text-dim);
}

.demo-card {
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: left;
}

.demo-card:hover {
  border-color: var(--accent-cyan);
  background: rgba(0, 240, 255, 0.05);
  transform: scale(1.02);
}

.demo-card-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.demo-card-size {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-family: var(--font-mono);
}

.demo-hint {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.demo-hint code {
  font-family: var(--font-mono);
  padding: 2px 6px;
  background: rgba(0, 240, 255, 0.1);
  border-radius: 4px;
  color: var(--accent-cyan);
}
</style>

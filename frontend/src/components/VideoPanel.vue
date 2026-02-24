<template>
  <div class="video-panel">
    <div class="panel-header">
      <h2 class="panel-title">
        <span class="panel-icon">🎬</span> 实时分析
      </h2>
      <div class="panel-controls">
        <button class="ctrl-btn" title="停止" @click="$emit('stop')">⏹</button>
        <button class="ctrl-btn" title="返回" @click="$emit('back')">✖</button>
      </div>
    </div>
    <div class="video-container">
      <canvas ref="canvasRef" class="video-canvas"></canvas>
      <div class="video-overlay" :class="{ hidden: hasFrame }">
        <div class="loading-skeleton">
          <div class="skeleton-body"></div>
        </div>
        <p>正在加载分析引擎...</p>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (progress * 100) + '%' }"></div>
      </div>
    </div>
    <ActionTimeline :action="action" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import ActionTimeline from './ActionTimeline.vue'

const props = defineProps({
  frameBase64: String,
  progress: { type: Number, default: 0 },
  action: Object,
})
defineEmits(['stop', 'back'])

const canvasRef = ref(null)
const hasFrame = computed(() => !!props.frameBase64)
const frameImage = new Image()

watch(() => props.frameBase64, (val) => {
  if (!val || !canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  frameImage.onload = () => {
    canvasRef.value.width = frameImage.naturalWidth
    canvasRef.value.height = frameImage.naturalHeight
    ctx.drawImage(frameImage, 0, 0)
  }
  frameImage.src = 'data:image/jpeg;base64,' + val
})
</script>

<style scoped>
.video-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-icon { font-size: 1.2rem; }

.panel-controls {
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
}

.ctrl-btn:hover {
  border-color: var(--accent-pink);
  color: var(--accent-pink);
}

.video-container {
  position: relative;
  flex: 1;
  min-height: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: rgba(6, 6, 18, 0.9);
  color: var(--text-secondary);
  font-size: 0.9rem;
  z-index: 5;
  transition: opacity var(--transition-normal);
}

.video-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.loading-skeleton {
  width: 60px;
  height: 100px;
  position: relative;
}

.skeleton-body {
  width: 100%;
  height: 100%;
  border: 2px solid var(--accent-cyan);
  border-radius: 30px 30px 0 0;
  opacity: 0.3;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-body::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-cyan);
  border-radius: 50%;
  opacity: 0.3;
  animation: skeleton-pulse 1.5s ease-in-out infinite 0.2s;
}

.skeleton-body::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 40px;
  background: var(--accent-cyan);
  opacity: 0.2;
  animation: skeleton-pulse 1.5s ease-in-out infinite 0.4s;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 10;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
  border-radius: 0 2px 2px 0;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px var(--accent-cyan);
}
</style>

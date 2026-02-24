<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-line1">运动智能</span>
        <span class="hero-line2">分析系统</span>
      </h1>
      <p class="hero-subtitle">
        基于实时骨骼追踪 & AI 动作识别的运动姿态分析
      </p>

      <div class="hero-features">
        <div class="feature-card">
          <span class="feature-icon">🦴</span>
          <span class="feature-label">实时骨骼追踪</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🎯</span>
          <span class="feature-label">击球动作识别</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📊</span>
          <span class="feature-label">生物力学分析</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔥</span>
          <span class="feature-label">运动热力图</span>
        </div>
      </div>

      <div class="hero-actions">
        <label class="upload-btn">
          <input type="file" accept="video/*" hidden @change="onFileChange">
          <span class="btn-icon">📤</span> 上传视频分析
        </label>
        <button class="demo-btn" @click="showDemo = !showDemo">
          <span class="btn-icon">▶️</span> 体验 Demo
        </button>
      </div>

      <DemoSelector
        v-if="showDemo"
        @select="onDemoSelect"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import DemoSelector from './DemoSelector.vue'

const emit = defineEmits(['start-analysis'])
const showDemo = ref(false)

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    emit('start-analysis', { source: 'file', file })
  }
}

function onDemoSelect(demo) {
  emit('start-analysis', { source: 'demo', id: demo.id })
}
</script>

<style scoped>
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 40px 24px;
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

.hero-title {
  margin-bottom: 20px;
}

.hero-line1 {
  display: block;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -2px;
  color: var(--text-primary);
  line-height: 1.1;
}

.hero-line2 {
  display: block;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -2px;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  border-color: var(--accent-cyan);
  transform: translateY(-4px);
  box-shadow: var(--glow-cyan);
}

.feature-icon { font-size: 2rem; }
.feature-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.upload-btn,
.demo-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: var(--radius-xl);
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
}

.upload-btn {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
  color: var(--bg-primary);
  border: none;
  box-shadow: 0 4px 20px rgba(0, 240, 255, 0.3);
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 240, 255, 0.4);
}

.demo-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-glow);
}

.demo-btn:hover {
  background: rgba(0, 240, 255, 0.1);
  border-color: var(--accent-cyan);
  box-shadow: var(--glow-cyan);
}

.btn-icon { font-size: 1.1rem; }

@media (max-width: 640px) {
  .hero-line1, .hero-line2 { font-size: 2.5rem; }
  .hero-features { grid-template-columns: repeat(2, 1fr); }
  .hero-actions { flex-direction: column; align-items: center; }
}
</style>

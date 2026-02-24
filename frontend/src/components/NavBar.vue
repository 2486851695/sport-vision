<template>
  <nav class="navbar">
    <div class="nav-brand">
      <span class="brand-icon">⚡</span>
      <span class="brand-text">SPORT<span class="accent">VISION</span></span>
      <span class="brand-tag">AI Motion Analysis</span>
    </div>
    <div class="nav-status">
      <span class="status-dot" :class="status"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  status: { type: String, default: 'ready' },
  statusText: { type: String, default: '就绪' },
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(6, 6, 18, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.5));
  animation: pulse-glow 2s ease-in-out infinite;
}

.brand-text {
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: 2px;
  color: var(--text-primary);
}

.brand-text .accent {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tag {
  font-size: 0.6rem;
  color: var(--text-dim);
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 8px;
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-dim);
  transition: all var(--transition-normal);
}

.status-dot.active {
  background: var(--accent-green);
  box-shadow: 0 0 10px var(--accent-green);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

.status-dot.processing {
  background: var(--accent-cyan);
  box-shadow: 0 0 10px var(--accent-cyan);
  animation: pulse-dot 0.8s ease-in-out infinite;
}
</style>

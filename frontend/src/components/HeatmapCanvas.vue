<template>
  <div class="data-card">
    <div class="card-header">🔥 运动热力图</div>
    <canvas ref="canvasRef" class="heatmap-canvas" width="280" height="200"></canvas>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  trajectoryData: { type: Array, default: () => [] },
  videoWidth: { type: Number, default: 960 },
  videoHeight: { type: Number, default: 540 },
})

const canvasRef = ref(null)

watch(() => props.trajectoryData, (data) => {
  if (!canvasRef.value || !data || data.length === 0) return
  draw(data)
}, { deep: true })

function draw(data) {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const w = canvas.width, h = canvas.height

  ctx.fillStyle = '#0c0c24'
  ctx.fillRect(0, 0, w, h)

  // court outline
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.strokeRect(10, 10, w - 20, h - 20)
  ctx.beginPath()
  ctx.moveTo(w / 2, 10)
  ctx.lineTo(w / 2, h - 10)
  ctx.stroke()

  const sx = (w - 20) / (props.videoWidth || 960)
  const sy = (h - 20) / (props.videoHeight || 540)

  // heat points
  for (let i = 0; i < data.length; i++) {
    const p = data[i]
    const px = 10 + p.x * sx
    const py = 10 + p.y * sy
    const alpha = (i / data.length) * 0.6 + 0.1

    const gradient = ctx.createRadialGradient(px, py, 0, px, py, 12)
    gradient.addColorStop(0, `rgba(255,51,102,${alpha})`)
    gradient.addColorStop(0.5, `rgba(255,170,51,${alpha * 0.5})`)
    gradient.addColorStop(1, 'rgba(255,170,51,0)')

    ctx.beginPath()
    ctx.arc(px, py, 12, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }

  // trajectory line
  if (data.length > 1) {
    ctx.beginPath()
    ctx.moveTo(10 + data[0].x * sx, 10 + data[0].y * sy)
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(10 + data[i].x * sx, 10 + data[i].y * sy)
    }
    ctx.strokeStyle = 'rgba(0,240,255,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}
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

.heatmap-canvas {
  width: 100%;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
}
</style>

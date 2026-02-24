<template>
  <div class="data-card">
    <div class="card-header">🦴 关节角度</div>
    <div class="angles-grid">
      <div v-for="g in gauges" :key="g.id" class="angle-item">
        <canvas :ref="el => g.el = el" class="angle-gauge" width="80" height="80"></canvas>
        <span class="angle-label">{{ g.label }}</span>
        <span class="angle-value">{{ Math.round(g.current) }}°</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({ jointAngles: Object })

const gauges = reactive([
  { id: 'right_elbow', label: '右肘', target: 0, current: 0, el: null },
  { id: 'left_elbow', label: '左肘', target: 0, current: 0, el: null },
  { id: 'right_knee', label: '右膝', target: 0, current: 0, el: null },
  { id: 'left_knee', label: '左膝', target: 0, current: 0, el: null },
])

watch(() => props.jointAngles, (val) => {
  if (!val) return
  for (const g of gauges) {
    if (val[g.id] !== undefined) g.target = val[g.id]
  }
})

let animId
function animate() {
  for (const g of gauges) {
    g.current += (g.target - g.current) * 0.15
    drawGauge(g)
  }
  animId = requestAnimationFrame(animate)
}

function drawGauge(g) {
  const canvas = g.el
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width, h = canvas.height
  const cx = w / 2, cy = h / 2
  const radius = Math.min(w, h) / 2 - 8

  ctx.clearRect(0, 0, w, h)

  // bg arc
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, 2.25 * Math.PI)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.stroke()

  // value arc
  const norm = Math.min(g.current / 180, 1)
  const endAngle = 0.75 * Math.PI + norm * 1.5 * Math.PI
  let color = g.current < 60 ? '#ff3366' : g.current < 120 ? '#ffaa33' : '#33ff88'

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0.75 * Math.PI, endAngle)
  ctx.strokeStyle = color
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.shadowColor = color
  ctx.shadowBlur = 8
  ctx.stroke()
  ctx.shadowBlur = 0

  // text
  ctx.fillStyle = '#e8e8f0'
  ctx.font = "600 14px 'Inter', sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${Math.round(g.current)}°`, cx, cy + 2)
}

onMounted(() => { animId = requestAnimationFrame(animate) })
onUnmounted(() => { if (animId) cancelAnimationFrame(animId) })
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

.angles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.angle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.angle-gauge { border-radius: 50%; }

.angle-label {
  font-size: 0.7rem;
  color: var(--text-dim);
  font-weight: 500;
}

.angle-value {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-cyan);
}
</style>

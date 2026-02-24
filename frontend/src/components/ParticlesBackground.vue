<template>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animId = null
let particles = []
const PARTICLE_COUNT = 80
const MAX_DISTANCE = 150
const COLORS = ['#00f0ff', '#3366ff', '#8844ff', '#33ff88']

function createParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.1,
  }
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function init() {
    resize()
    particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(canvas.width, canvas.height))
    }
  }

  function animate() {
    // update
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
    }

    // draw
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MAX_DISTANCE) {
          const alpha = (1 - dist / MAX_DISTANCE) * 0.15
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    for (const p of particles) {
      const { r, g, b } = hexToRgb(p.color)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.2})`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`
      ctx.fill()
    }

    animId = requestAnimationFrame(animate)
  }

  window.addEventListener('resize', resize)
  init()
  animate()

  onUnmounted(() => {
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>

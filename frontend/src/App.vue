<template>
  <ParticlesBackground />
  <NavBar :status="status" :status-text="statusText" />
  <main class="main-container">
    <HeroSection
      v-if="!isAnalyzing && !analysisComplete"
      @start-analysis="startAnalysis"
    />
    <AnalysisSection
      v-else
      :frame-data="frameData"
      @stop="stopAnalysis"
      @back="goBack"
    />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import ParticlesBackground from './components/ParticlesBackground.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AnalysisSection from './components/AnalysisSection.vue'
import { useAnalysis } from './composables/useAnalysis.js'

const {
  status,
  statusText,
  isAnalyzing,
  analysisComplete,
  frameData,
  startAnalysis,
  stopAnalysis,
  goBack,
} = useAnalysis()
</script>

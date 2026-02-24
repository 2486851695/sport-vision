<template>
  <section class="analysis-section">
    <div class="analysis-layout">
      <!-- 左侧：视频区域 -->
      <VideoPanel
        :frame-base64="frameData.frameBase64"
        :progress="frameData.progress"
        :action="frameData.action"
        @stop="$emit('stop')"
        @back="$emit('back')"
      />

      <!-- 右侧：数据面板 -->
      <div class="data-panel">
        <ActionCard :action="frameData.action" />
        <AngleGauges :joint-angles="frameData.pose?.joint_angles" />
        <BiomechanicsPanel :biomechanics="frameData.pose?.biomechanics" />
        <ActionStats :action-counts="frameData.action?.action_counts" />
        <HeatmapCanvas
          :trajectory-data="frameData.heatmapData"
          :video-width="frameData.width"
          :video-height="frameData.height"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import VideoPanel from './VideoPanel.vue'
import ActionCard from './ActionCard.vue'
import AngleGauges from './AngleGauges.vue'
import BiomechanicsPanel from './BiomechanicsPanel.vue'
import ActionStats from './ActionStats.vue'
import HeatmapCanvas from './HeatmapCanvas.vue'

defineProps({ frameData: Object })
defineEmits(['stop', 'back'])
</script>

<style scoped>
.analysis-section {
  padding: 16px;
  animation: fadeUp 0.5s ease;
}

.analysis-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 92px);
  overflow: hidden;
}

.data-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-subtle) transparent;
}

@media (max-width: 1024px) {
  .analysis-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .data-panel {
    max-height: none;
  }
}
</style>

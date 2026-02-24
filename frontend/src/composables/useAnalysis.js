import { ref, reactive } from 'vue'

export function useAnalysis() {
  const status = ref('ready')        // ready | processing | active
  const statusText = ref('就绪')
  const isAnalyzing = ref(false)
  const analysisComplete = ref(false)
  const frameData = reactive({
    frameBase64: null,
    progress: 0,
    pose: null,
    action: null,
    heatmapData: [],
    width: 960,
    height: 540,
    frameNumber: 0,
  })

  let ws = null

  function setStatus(type, text) {
    status.value = type
    statusText.value = text
  }

  async function uploadVideo(file) {
    setStatus('processing', '上传中...')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const resp = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await resp.json()
      if (data.error) {
        alert(data.error)
        setStatus('ready', '就绪')
        return null
      }
      return data.path
    } catch (err) {
      alert('上传失败: ' + err.message)
      setStatus('ready', '就绪')
      return null
    }
  }

  function startAnalysis({ source, id, path, file }) {
    // 如果是文件上传，先上传再分析
    if (source === 'file' && file) {
      uploadVideo(file).then((uploadedPath) => {
        if (uploadedPath) {
          connectAndStart({ source: 'upload', path: uploadedPath })
        }
      })
      return
    }
    connectAndStart({ source, id, path })
  }

  function connectAndStart({ source, id, path }) {
    // 重置状态
    frameData.frameBase64 = null
    frameData.progress = 0
    frameData.pose = null
    frameData.action = null
    frameData.heatmapData = []
    frameData.frameNumber = 0
    isAnalyzing.value = true
    analysisComplete.value = false

    setStatus('processing', '连接分析引擎...')

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    ws = new WebSocket(`${protocol}//${location.host}/ws/analyze`)

    ws.onopen = () => {
      setStatus('processing', '分析中...')
      const msg = { type: 'start', source }
      if (source === 'demo') msg.id = id
      if (source === 'upload') msg.path = path
      ws.send(JSON.stringify(msg))
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      handleMessage(msg)
    }

    ws.onerror = () => {
      setStatus('ready', '连接错误')
    }

    ws.onclose = () => {
      if (isAnalyzing.value) {
        setStatus('active', '分析完成')
        isAnalyzing.value = false
        analysisComplete.value = true
      }
    }
  }

  function handleMessage(msg) {
    switch (msg.type) {
      case 'started':
        setStatus('processing', '分析中...')
        break
      case 'frame':
        onFrame(msg.data)
        break
      case 'complete':
        setStatus('active', '分析完成')
        isAnalyzing.value = false
        analysisComplete.value = true
        break
      case 'stopped':
        setStatus('ready', '已停止')
        isAnalyzing.value = false
        break
      case 'error':
        setStatus('ready', `错误: ${msg.message}`)
        isAnalyzing.value = false
        break
    }
  }

  function onFrame(data) {
    if (data.frame_base64) frameData.frameBase64 = data.frame_base64
    frameData.progress = data.progress || 0
    frameData.width = data.width || 960
    frameData.height = data.height || 540
    frameData.frameNumber = data.frame_number || 0
    if (data.pose) frameData.pose = data.pose
    if (data.action) frameData.action = data.action
    if (data.heatmap_data) frameData.heatmapData = data.heatmap_data
  }

  function stopAnalysis() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'stop' }))
    }
    isAnalyzing.value = false
    setStatus('ready', '已停止')
  }

  function goBack() {
    stopAnalysis()
    if (ws) {
      ws.close()
      ws = null
    }
    isAnalyzing.value = false
    analysisComplete.value = false
    setStatus('ready', '就绪')
  }

  return {
    status,
    statusText,
    isAnalyzing,
    analysisComplete,
    frameData,
    startAnalysis,
    stopAnalysis,
    goBack,
  }
}

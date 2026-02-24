# AGENTS.md

本文件为 WARP (warp.dev) 在此仓库中工作时提供指导。

## 项目概述

Sport Vision 是一个基于 AI 的球拍类运动动作分析系统。后端使用 FastAPI，通过 MediaPipe PoseLandmarker 进行骨骼追踪，结合规则引擎的动作识别器和运动生物力学分析，经 WebSocket 将结果实时推送给 Vue 3 前端。所有推理均在本地 CPU 运行，无需云端 API 或 GPU。

## 构建与运行命令

```bash
# === 后端 ===
python -m venv .venv
# Unix: source .venv/bin/activate
# Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 下载姿态模型（首次运行前必须执行）
# Unix:
curl -sL -o models/pose_landmarker_lite.task \
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
# Windows (PowerShell):
Invoke-WebRequest -Uri "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task" -OutFile models/pose_landmarker_lite.task

# === 前端（Vue 3 + Vite）===
npm install --prefix frontend
npm run build --prefix frontend

# === 启动 ===
# 开发模式（后端 + Vue dev server 并行）
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
npm run dev --prefix frontend  # 另开终端，访问 http://localhost:5173

# 生产模式（先 build 前端，再启动后端）
npm run build --prefix frontend
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000  # 访问 http://localhost:8000
```

将 `.mp4` 文件放入 `demo_videos/` 目录即可作为演示内容。

## 架构

### 数据流

视频帧通过单线程异步流水线依次处理：

1. **`Pipeline`**（`backend/pipeline.py`）— 编排逐帧处理循环：通过 OpenCV 读取帧，缩放至最大宽度 960px，BGR→RGB 转换，控制输出帧率。
2. **`PoseAnalyzer`**（`backend/pose_analyzer.py`）— 以 IMAGE 模式（非 video/livestream）运行 MediaPipe PoseLandmarker，从完整 33 个关键点中提取 13 个子集，计算 8 个关节角度、重心位置，以及生物力学指标（手腕速度、身体倾斜、膝盖弯曲、手臂伸展、对称性）。
3. **`ActionRecognizer`**（`backend/action_recognizer.py`）— 基于规则的识别引擎，使用关键点历史的滑动窗口。通过手腕位置/速度、肘部角度、身体移动的阈值判断来分类动作（发球、正手、反手、高吊）。内置去抖动机制防止重复检测。
4. **`Visualizer`**（`backend/visualizer.py`）— 使用 OpenCV 在帧上渲染骨骼叠加、运动轨迹、关节角度和动作标签。输出经 JPEG 编码后再 base64 编码，通过 WebSocket 传输。

### WebSocket 协议

端点：`ws://<host>/ws/analyze`

客户端发送：
- `{"type": "start", "source": "demo", "id": "<demo文件名>"}` — 开始分析演示视频
- `{"type": "start", "source": "upload", "path": "<文件路径>"}` — 开始分析上传的视频
- `{"type": "stop"}` — 停止当前分析

服务端推送：
- `{"type": "started", ...}` — 分析已启动
- `{"type": "frame", "data": {...}}` — 逐帧结果（base64 帧 + 姿态 + 动作 + 热力图数据）
- `{"type": "complete", ...}` — 视频处理完成
- `{"type": "error", "message": "..."}` — 发生错误

### 前端

Vue 3 + Vite 单页应用，源码在 `frontend/src/`，构建产物输出到 `frontend/dist/`。

组件结构：
- `App.vue` — 根组件，管理首页/分析视图切换
- `composables/useAnalysis.js` — WebSocket 连接、分析状态管理、上传逻辑（核心状态层）
- `components/ParticlesBackground.vue` — 背景粒子动画
- `components/NavBar.vue` — 导航栏 + 状态指示
- `components/HeroSection.vue` — 首页（上传/演示入口）
- `components/DemoSelector.vue` — 演示视频选择器
- `components/AnalysisSection.vue` — 分析视图主布局
- `components/VideoPanel.vue` — 视频画布 + 加载状态 + 进度条
- `components/ActionTimeline.vue` — 动作时间线
- `components/ActionCard.vue` — 当前动作卡片
- `components/AngleGauges.vue` — 关节角度仪表盘（requestAnimationFrame 动画）
- `components/BiomechanicsPanel.vue` — 生物力学统计条
- `components/ActionStats.vue` — 动作计数统计
- `components/HeatmapCanvas.vue` — 运动热力图

### 静态文件服务

开发时：Vite dev server（端口 5173）通过 proxy 将 `/api`、`/ws`、`/demo_videos` 转发到后端（端口 8000）。生产时：FastAPI 从 `frontend/dist/` 目录提供静态文件服务。

## 关键约定

- **语言风格**：代码注释和 UI 标签使用中文；变量名、文档字符串和 API 字段使用英文。
- **关键点索引**：系统使用 MediaPipe PoseLandmarker 33 个关键点中的 13 个子集（索引 0, 11-16, 23-28）。映射关系见 `PoseAnalyzer.LANDMARK_NAMES`。
- **坐标系**：关键点坐标为像素空间（基于缩放后的帧）。垂直速度正值 = 向下。`y` 轴向下递增。
- **动作识别阈值**：集中在 `ActionRecognizer._recognize()` 中，为经验调参的像素距离和角度阈值，修改时需谨慎。
- **帧编码方式**：流水线通过 WebSocket 发送完整渲染帧（JPEG base64），而非原始关键点数据供客户端渲染，因此用户看到的是 `Visualizer` 的输出。
- **无测试套件** — 项目当前没有自动化测试。
- **无代码检查/格式化配置** — 没有 pyproject.toml、setup.cfg 或 linting 配置文件。

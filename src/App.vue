<script setup>
import { ref } from 'vue'
import { Panel, PanelGroup, PanelResizeHandle } from "vue-resizable-panels"

// Generate dummy data for el-tree-v2
const createData = (maxDeep, maxChildren, minNodesNumber, deep = 1, key = 'node') => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber =
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = `${key}-${++id}`
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      }
    })
}

const data = ref(createData(4, 30, 40))
</script>

<template>
  <div class="app-container">
    <PanelGroup direction="horizontal">
      <Panel :defaultSize="30" :minSize="20">
        <div class="left-panel">
          <h3>目录结构 (Tree V2)</h3>
          <!-- 树形结构作为占位 -->
          <el-tree-v2 :data="data" :height="800" />
        </div>
      </Panel>
      
      <!-- 中间的分界线 -->
      <PanelResizeHandle class="resize-handle" />
      
      <Panel :minSize="30">
        <div class="right-panel">
          <h2>页面内容占位符</h2>
          <el-empty description="请在左侧选择一个节点" />
          <p>这是右侧的占位文本内容。您可以拖动中间的分界线来调整左右两边的比例。</p>
          <p>左侧面板最小占比为 20%，右侧面板最小占比为 30%。当到达最小值时将无法继续拖动。</p>
        </div>
      </Panel>
    </PanelGroup>
  </div>
</template>

<style>
/* Reset basic margins */
body, html {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

#app {
  height: 100vh;
}

.app-container {
  height: 100vh;
  display: flex;
}

.left-panel {
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.left-panel h3 {
  margin-top: 0;
  color: #303133;
}

.right-panel {
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #606266;
  line-height: 1.6;
}

/* 分界线样式 */
.resize-handle {
  width: 6px;
  background-color: #e4e7ed;
  cursor: col-resize;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.resize-handle:hover,
.resize-handle[data-resize-handle-active] {
  background-color: #409eff;
}

/* 确保虚拟树容器样式自适应 */
.el-tree-v2 {
  background: transparent !important;
  flex-grow: 1;
}
</style>

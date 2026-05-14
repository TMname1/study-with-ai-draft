<script setup>
import { computed } from 'vue'
import { Panel, PanelGroup, PanelResizeHandle } from "vue-resizable-panels"
import { useDirectoryStore } from './stores/directory'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const store = useDirectoryStore()

// Helper to find node in tree by id
function findNode(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

const selectedNode = computed(() => {
  if (!store.selectedNodeId) return null
  return findNode(store.treeData, store.selectedNodeId)
})

function addRoot() {
  store.addRootNode()
}

function addChild(parentId) {
  store.addChildNode(parentId)
}

function removeNode(id) {
  store.removeNode(id)
}

function handleNodeClick(data) {
  store.selectedNodeId = data.id
}

function updateSelected(field, value) {
  if (store.selectedNodeId) {
    store.updateNode(store.selectedNodeId, { [field]: value })
  }
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return ''
  return dayjs(timestamp).fromNow()
}
</script>

<template>
  <div class="app-container">
    <PanelGroup direction="horizontal">
      <Panel :defaultSize="30" :minSize="20">
        <div class="left-panel">
          <el-button type="primary" class="add-root-btn" @click="addRoot">Add Root Node</el-button>
          
          <el-tree
            :data="store.treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            class="custom-tree"
          >
            <template #default="{ data }">
              <div class="custom-tree-node">
                <span class="node-label">{{ data.title || 'Untitled Node' }}</span>
                <span class="node-actions" @click.stop>
                  <el-button link type="primary" size="small" @click.stop="addChild(data.id)">
                    Add Child
                  </el-button>
                  <el-button link type="danger" size="small" @click.stop="removeNode(data.id)">
                    Delete
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </Panel>
      
      <!-- 中间的分界线 -->
      <PanelResizeHandle class="resize-handle" />
      
      <Panel :minSize="30">
        <div class="right-panel">
          <template v-if="selectedNode">
            <el-form label-position="top" class="details-form">
              <el-form-item label="创建该节点的原因">
                <el-input 
                  :model-value="selectedNode.title" 
                  @input="updateSelected('title', $event)" 
                />
              </el-form-item>
              
              <el-form-item label="网页链接">
                <el-input 
                  :model-value="selectedNode.link" 
                  @input="updateSelected('link', $event)" 
                />
              </el-form-item>
              
              <el-form-item label="用于搜索定位的文本">
                <el-input 
                  type="textarea" 
                  :model-value="selectedNode.searchText" 
                  @input="updateSelected('searchText', $event)" 
                />
              </el-form-item>

              <el-form-item label="创建时间">
                <div class="time-display">
                  <span class="absolute-time">{{ formatTime(selectedNode.createdAt) }}</span>
                  <span class="relative-time">({{ formatRelativeTime(selectedNode.createdAt) }})</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <el-empty description="Select a node to view details" />
          </template>
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

.add-root-btn {
  margin-bottom: 16px;
}

.custom-tree {
  flex: 1;
  overflow-y: auto;
  background-color: transparent !important;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.node-label {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.node-actions {
  display: flex;
  gap: 8px;
}

.right-panel {
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #606266;
  line-height: 1.6;
  overflow-y: auto;
}

.details-form {
  max-width: 600px;
}

.time-display {
  display: flex;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.relative-time {
  color: #909399;
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
</style>

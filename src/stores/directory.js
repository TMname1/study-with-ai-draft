import { defineStore } from 'pinia'

function removeNodeFromTree(nodes, nodeId) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const found = removeNodeFromTree(nodes[i].children, nodeId)
      if (found) return true
    }
  }
  return false
}

function updateNodeInTree(nodes, nodeId, payload) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) {
      nodes[i] = { ...nodes[i], ...payload }
      return true
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const found = updateNodeInTree(nodes[i].children, nodeId, payload)
      if (found) return true
    }
  }
  return false
}

function addChildToNode(nodes, parentId, newNode) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === parentId) {
      if (!nodes[i].children) {
        nodes[i].children = []
      }
      nodes[i].children.push(newNode)
      return true
    }
    if (nodes[i].children && nodes[i].children.length > 0) {
      const found = addChildToNode(nodes[i].children, parentId, newNode)
      if (found) return true
    }
  }
  return false
}

export const useDirectoryStore = defineStore('directory', {
  state: () => ({
    treeData: [],
    selectedNodeId: null
  }),
  actions: {
    addRootNode() {
      const newNode = {
        id: crypto.randomUUID(),
        title: 'New Root Node',
        link: '',
        searchText: '',
        createdAt: Date.now(),
        children: []
      }
      this.treeData.push(newNode)
    },
    addChildNode(parentId) {
      const newNode = {
        id: crypto.randomUUID(),
        title: 'New Child Node',
        link: '',
        searchText: '',
        createdAt: Date.now(),
        children: []
      }
      addChildToNode(this.treeData, parentId, newNode)
    },
    removeNode(nodeId) {
      removeNodeFromTree(this.treeData, nodeId)
      if (this.selectedNodeId === nodeId) {
        this.selectedNodeId = null
      }
    },
    updateNode(id, payload) {
      updateNodeInTree(this.treeData, id, payload)
    }
  },
  persist: true
})

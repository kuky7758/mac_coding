<template>
  <div class="post-list">
    <div v-if="store.isEmpty" class="empty-state">
      还没有内容，写下一句话吧
    </div>
    <div
      v-for="post in store.sortedPosts"
      :key="post.id"
      class="post-card"
    >
      <div class="post-content">{{ post.content }}</div>
      <div class="post-time">{{ formatTime(post.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup>
import { usePostStore } from '../stores/postStore.js'

const store = usePostStore()

function formatTime(timestamp) {
  const d = new Date(timestamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 3px solid #a5d6a7;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-content {
  font-size: 15px;
  word-break: break-word;
  white-space: pre-wrap;
}

.post-time {
  font-size: 12px;
  color: #81c784;
  margin-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a5d6a7;
  font-size: 14px;
  font-style: italic;
}
</style>

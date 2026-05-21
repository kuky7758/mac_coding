<template>
  <div class="input-card">
    <textarea
      v-model="inputContent"
      placeholder="分享新鲜事..."
      aria-label="分享内容"
      :maxlength="280"
    />
    <div class="input-footer">
      <span class="char-count" :class="{ 'over-limit': isOverLimit }">
        {{ charCount }}/280
      </span>
      <button @click="handlePublish" :disabled="isPublishing">发布</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePostStore } from '../stores/postStore.js'

const store = usePostStore()
const inputContent = ref('')
const isPublishing = ref(false)

const charCount = computed(() => inputContent.value.length)
const isOverLimit = computed(() => charCount.value > 280)

async function handlePublish() {
  if (isPublishing.value) return

  const content = inputContent.value.trim()
  if (!content) {
    return
  }

  isPublishing.value = true
  try {
    const success = await store.publishPost(content)
    if (success) {
      inputContent.value = ''
    }
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.input-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #4caf50;
}

textarea {
  width: 100%;
  min-height: 80px;
  max-height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.input-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
}

.char-count {
  font-size: 13px;
  color: #999;
}

.char-count.over-limit {
  color: #f44336;
  font-weight: 500;
}

button {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

button:hover:not(:disabled) {
  background: #43a047;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
  transform: translateY(-1px);
}

button:disabled {
  background: #c8e6c9;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'qingyu_posts'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])

  const sortedPosts = computed(() =>
    [...posts.value].sort((a, b) => b.timestamp - a.timestamp)
  )

  const isEmpty = computed(() => posts.value.length === 0)

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      posts.value = raw ? JSON.parse(raw) : []
    } catch (e) {
      console.error('读取数据失败', e)
      posts.value = []
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.value))
      return true
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('存储空间不足，请清理后重试')
      } else {
        alert('保存失败，请重试')
      }
      return false
    }
  }

  function publishPost(content) {
    const trimmed = content.trim()
    if (!trimmed) return false

    const now = Date.now()
    const newPost = { id: now, content: trimmed, timestamp: now }
    posts.value.push(newPost)

    if (!saveToStorage()) {
      posts.value.pop()
      return false
    }
    return true
  }

  loadFromStorage()

  return { posts, sortedPosts, isEmpty, loadFromStorage, publishPost }
})

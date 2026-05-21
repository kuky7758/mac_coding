import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getPosts,
  createPost,
  likePost,
  unlikePost,
  favoritePost,
  unfavoritePost,
} from '../api/client.js'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])

  const sortedPosts = computed(() =>
    [...posts.value].sort((a, b) => b.timestamp - a.timestamp)
  )

  const isEmpty = computed(() => posts.value.length === 0)

  async function loadPosts() {
    try {
      const data = await getPosts()
      posts.value = Array.isArray(data) ? data : []
    } catch (e) {
      console.error('加载帖子失败', e)
      posts.value = []
    }
  }

  async function publishPost(content) {
    const trimmed = content.trim()
    if (!trimmed) return false

    try {
      const newPost = await createPost(trimmed)
      posts.value.unshift(newPost)
      return true
    } catch (e) {
      console.error('发布失败', e)
      return false
    }
  }

  async function toggleLike(id) {
    const post = posts.value.find((p) => p.id === id)
    if (!post) return
    try {
      const result = post.hasLiked ? await unlikePost(id) : await likePost(id)
      post.likeCount = result.likeCount
      post.hasLiked = result.hasLiked
    } catch (e) {
      console.error('点赞操作失败', e)
    }
  }

  async function toggleFavorite(id) {
    const post = posts.value.find((p) => p.id === id)
    if (!post) return
    try {
      const result = post.hasFavorited
        ? await unfavoritePost(id)
        : await favoritePost(id)
      post.favoriteCount = result.favoriteCount
      post.hasFavorited = result.hasFavorited
    } catch (e) {
      console.error('收藏操作失败', e)
    }
  }

  loadPosts()

  return {
    posts,
    sortedPosts,
    isEmpty,
    loadPosts,
    publishPost,
    toggleLike,
    toggleFavorite,
  }
})

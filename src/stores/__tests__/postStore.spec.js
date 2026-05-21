import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../postStore.js'
import * as client from '../../api/client.js'

vi.mock('../../api/client.js')

async function waitForInit() {
  await new Promise(r => setTimeout(r, 0))
}

describe('postStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    client.getPosts.mockResolvedValue([])
  })

  it('初始状态为空数组', async () => {
    const store = usePostStore()
    await waitForInit()
    expect(store.posts).toEqual([])
    expect(store.isEmpty).toBe(true)
  })

  it('loadPosts 从 API 获取帖子并赋值', async () => {
    const posts = [
      { id: 1, content: '第一条', timestamp: 1000, likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false },
      { id: 2, content: '第二条', timestamp: 2000, likeCount: 1, favoriteCount: 2, hasLiked: true, hasFavorited: true },
    ]
    client.getPosts.mockResolvedValue(posts)
    const store = usePostStore()
    await store.loadPosts()
    expect(client.getPosts).toHaveBeenCalled()
    expect(store.posts).toEqual(posts)
    expect(store.isEmpty).toBe(false)
  })

  it('publishPost 调用 API 并把返回帖子 unshift 到列表', async () => {
    const newPost = { id: 3, content: '新帖子', timestamp: 3000, likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false }
    client.createPost.mockResolvedValue(newPost)
    const store = usePostStore()
    await waitForInit()
    store.posts = [{ id: 1, content: '已有', timestamp: 1000 }]
    const result = await store.publishPost('新帖子')
    expect(result).toBe(true)
    expect(client.createPost).toHaveBeenCalledWith('新帖子')
    expect(store.posts[0]).toEqual(newPost)
    expect(store.posts).toHaveLength(2)
  })

  it('publishPost 空内容返回 false', async () => {
    const store = usePostStore()
    await waitForInit()
    expect(await store.publishPost('')).toBe(false)
    expect(await store.publishPost('   ')).toBe(false)
    expect(client.createPost).not.toHaveBeenCalled()
  })

  it('sortedPosts 按时间倒序排列', async () => {
    const store = usePostStore()
    await waitForInit()
    store.posts = [
      { id: 1, content: '第一条', timestamp: 1000 },
      { id: 2, content: '第二条', timestamp: 2000 },
    ]
    expect(store.sortedPosts[0].content).toBe('第二条')
    expect(store.sortedPosts[1].content).toBe('第一条')
  })

  it('toggleLike 为未点赞帖子点赞', async () => {
    client.likePost.mockResolvedValue({ likeCount: 5, hasLiked: true })
    const store = usePostStore()
    await waitForInit()
    store.posts = [{ id: 1, content: '测试', timestamp: 1000, likeCount: 4, hasLiked: false }]
    await store.toggleLike(1)
    expect(client.likePost).toHaveBeenCalledWith(1)
    expect(store.posts[0].likeCount).toBe(5)
    expect(store.posts[0].hasLiked).toBe(true)
  })

  it('toggleLike 为已点赞帖子取消点赞', async () => {
    client.unlikePost.mockResolvedValue({ likeCount: 3, hasLiked: false })
    const store = usePostStore()
    await waitForInit()
    store.posts = [{ id: 1, content: '测试', timestamp: 1000, likeCount: 4, hasLiked: true }]
    await store.toggleLike(1)
    expect(client.unlikePost).toHaveBeenCalledWith(1)
    expect(store.posts[0].likeCount).toBe(3)
    expect(store.posts[0].hasLiked).toBe(false)
  })

  it('toggleFavorite 为未收藏帖子收藏', async () => {
    client.favoritePost.mockResolvedValue({ favoriteCount: 2, hasFavorited: true })
    const store = usePostStore()
    await waitForInit()
    store.posts = [{ id: 1, content: '测试', timestamp: 1000, favoriteCount: 1, hasFavorited: false }]
    await store.toggleFavorite(1)
    expect(client.favoritePost).toHaveBeenCalledWith(1)
    expect(store.posts[0].favoriteCount).toBe(2)
    expect(store.posts[0].hasFavorited).toBe(true)
  })

  it('toggleFavorite 为已收藏帖子取消收藏', async () => {
    client.unfavoritePost.mockResolvedValue({ favoriteCount: 0, hasFavorited: false })
    const store = usePostStore()
    await waitForInit()
    store.posts = [{ id: 1, content: '测试', timestamp: 1000, favoriteCount: 1, hasFavorited: true }]
    await store.toggleFavorite(1)
    expect(client.unfavoritePost).toHaveBeenCalledWith(1)
    expect(store.posts[0].favoriteCount).toBe(0)
    expect(store.posts[0].hasFavorited).toBe(false)
  })
})

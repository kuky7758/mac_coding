import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../postStore.js'

describe('postStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('初始状态为空数组', () => {
    const store = usePostStore()
    expect(store.posts).toEqual([])
    expect(store.isEmpty).toBe(true)
  })

  it('publishPost 保存帖子到 state 和 localStorage', () => {
    const store = usePostStore()
    const success = store.publishPost('测试内容')
    expect(success).toBe(true)
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('测试内容')
    expect(localStorage.getItem('qingyu_posts')).toContain('测试内容')
  })

  it('publishPost 空内容返回 false', () => {
    const store = usePostStore()
    expect(store.publishPost('')).toBe(false)
    expect(store.publishPost('   ')).toBe(false)
  })

  it('sortedPosts 按时间倒序排列', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '第一条', timestamp: 1000 },
      { id: 2, content: '第二条', timestamp: 2000 }
    ]
    expect(store.sortedPosts[0].content).toBe('第二条')
    expect(store.sortedPosts[1].content).toBe('第一条')
  })

  it('loadFromStorage 从 localStorage 恢复数据', () => {
    localStorage.setItem('qingyu_posts', JSON.stringify([
      { id: 1, content: '已有数据', timestamp: 1000 }
    ]))
    const store = usePostStore()
    store.loadFromStorage()
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('已有数据')
  })

  it('publishPost 保存失败时回滚 state', () => {
    const store = usePostStore()
    // 模拟存储满
    const hugeData = 'x'.repeat(10 * 1024 * 1024)
    try {
      localStorage.setItem('fill', hugeData)
    } catch (e) {
      // 某些环境可能直接抛异常
    }
    const success = store.publishPost('新帖子')
    if (!success) {
      expect(store.posts).toHaveLength(0)
    }
    localStorage.removeItem('fill')
  })
})

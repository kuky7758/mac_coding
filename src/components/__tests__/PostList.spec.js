import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostList from '../PostList.vue'
import { usePostStore } from '../../stores/postStore.js'
import * as client from '../../api/client.js'

vi.mock('../../api/client.js')

describe('PostList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('无帖子时显示空状态', () => {
    const wrapper = mount(PostList)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('还没有内容，写下一句话吧')
  })

  it('有帖子时渲染卡片列表', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试内容', timestamp: 1716280000000, likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.findAll('.post-card')).toHaveLength(1)
    expect(wrapper.find('.post-content').text()).toBe('测试内容')
  })

  it('卡片显示格式化时间', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: new Date('2024-05-21 10:30:00').getTime(), likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.find('.post-time').text()).toContain('2024-05-21')
    expect(wrapper.find('.post-time').text()).toContain('10:30')
  })

  it('多个帖子按时间倒序排列', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '第一条', timestamp: 1000, likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false },
      { id: 2, content: '第二条', timestamp: 2000, likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    const cards = wrapper.findAll('.post-content')
    expect(cards[0].text()).toBe('第二条')
    expect(cards[1].text()).toBe('第一条')
  })

  it('渲染 likeCount 和 favoriteCount', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: 1000, likeCount: 5, favoriteCount: 3, hasLiked: true, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.find('.like-btn').text()).toContain('5')
    expect(wrapper.find('.favorite-btn').text()).toContain('3')
  })

  it('已点赞时显示绿色，未点赞时显示灰色', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: 1000, likeCount: 5, favoriteCount: 0, hasLiked: true, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.find('.like-btn').attributes('style')).toContain('color: #4caf50')
  })

  it('点击点赞按钮触发 store.toggleLike', async () => {
    client.likePost.mockResolvedValue({ likeCount: 6, hasLiked: true })
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: 1000, likeCount: 5, favoriteCount: 0, hasLiked: false, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    await wrapper.find('.like-btn').trigger('click')
    expect(client.likePost).toHaveBeenCalledWith(1)
  })

  it('点击收藏按钮触发 store.toggleFavorite', async () => {
    client.favoritePost.mockResolvedValue({ favoriteCount: 1, hasFavorited: true })
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: 1000, likeCount: 0, favoriteCount: 0, hasLiked: false, hasFavorited: false }
    ]
    const wrapper = mount(PostList)
    await wrapper.find('.favorite-btn').trigger('click')
    expect(client.favoritePost).toHaveBeenCalledWith(1)
  })
})

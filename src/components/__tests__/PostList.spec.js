import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostList from '../PostList.vue'
import { usePostStore } from '../../stores/postStore.js'

describe('PostList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('无帖子时显示空状态', () => {
    const wrapper = mount(PostList)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('还没有内容，写下一句话吧')
  })

  it('有帖子时渲染卡片列表', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试内容', timestamp: 1716280000000 }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.findAll('.post-card')).toHaveLength(1)
    expect(wrapper.find('.post-content').text()).toBe('测试内容')
  })

  it('卡片显示格式化时间', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: new Date('2024-05-21 10:30:00').getTime() }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.find('.post-time').text()).toContain('2024-05-21')
    expect(wrapper.find('.post-time').text()).toContain('10:30')
  })

  it('多个帖子按时间倒序排列', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '第一条', timestamp: 1000 },
      { id: 2, content: '第二条', timestamp: 2000 }
    ]
    const wrapper = mount(PostList)
    const cards = wrapper.findAll('.post-content')
    expect(cards[0].text()).toBe('第二条')
    expect(cards[1].text()).toBe('第一条')
  })
})

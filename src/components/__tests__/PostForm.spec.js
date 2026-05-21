import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostForm from '../PostForm.vue'
import { usePostStore } from '../../stores/postStore.js'

describe('PostForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('渲染输入框和发布按钮', () => {
    const wrapper = mount(PostForm)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('发布')
  })

  it('输入内容后点击发布，清空输入框', async () => {
    const wrapper = mount(PostForm)
    await wrapper.find('textarea').setValue('Hello 轻语')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('发布后帖子进入 store', async () => {
    const wrapper = mount(PostForm)
    const store = usePostStore()
    await wrapper.find('textarea').setValue('测试发布')
    await wrapper.find('button').trigger('click')
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('测试发布')
  })

  it('字数统计实时更新', async () => {
    const wrapper = mount(PostForm)
    await wrapper.find('textarea').setValue('abc')
    expect(wrapper.find('.char-count').text()).toBe('3/280')
  })

  it('超出 280 字时字数标红', async () => {
    const wrapper = mount(PostForm)
    await wrapper.find('textarea').setValue('x'.repeat(281))
    expect(wrapper.find('.char-count').classes()).toContain('over-limit')
  })

  it('空内容点击发布不提交', async () => {
    const wrapper = mount(PostForm)
    const store = usePostStore()
    await wrapper.find('button').trigger('click')
    expect(store.posts).toHaveLength(0)
  })
})

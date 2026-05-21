import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src/app.js'
import { resetStore } from '../src/store/memoryStore.js'

const userId = 'test-user-1'

async function getPosts() {
  return app.request('/api/posts', {
    headers: { 'X-Anonymous-Id': userId }
  })
}

async function createPost(content) {
  return app.request('/api/posts', {
    method: 'POST',
    headers: {
      'X-Anonymous-Id': userId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  })
}

describe('GET /api/posts', () => {
  beforeEach(() => {
    resetStore()
  })

  it('返回空数组', async () => {
    const res = await getPosts()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([])
  })

  it('创建帖子后 GET 返回帖子', async () => {
    const createRes = await createPost('Hello world')
    expect(createRes.status).toBe(201)
    const created = await createRes.json()
    expect(created.id).toBe(1)
    expect(created.content).toBe('Hello world')
    expect(typeof created.timestamp).toBe('number')

    const res = await getPosts()
    const body = await res.json()
    expect(body.length).toBe(1)
    expect(body[0].content).toBe('Hello world')
  })

  it('GET 返回包含计数和状态', async () => {
    await createPost('Test post')
    const res = await getPosts()
    const body = await res.json()
    expect(body[0]).toMatchObject({
      id: 1,
      content: 'Test post',
      likeCount: 0,
      favoriteCount: 0,
      hasLiked: false,
      hasFavorited: false
    })
  })
})

describe('POST /api/posts', () => {
  beforeEach(() => {
    resetStore()
  })

  it('空内容返回 400', async () => {
    const res = await createPost('')
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('缺少 content 返回 400', async () => {
    const res = await app.request('/api/posts', {
      method: 'POST',
      headers: {
        'X-Anonymous-Id': userId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    expect(res.status).toBe(400)
  })
})

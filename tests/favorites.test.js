import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src/app.js'
import { resetStore } from '../src/store/memoryStore.js'

const userId = 'test-user-1'

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

async function getPosts() {
  return app.request('/api/posts', {
    headers: { 'X-Anonymous-Id': userId }
  })
}

async function favoritePost(postId, uid = userId) {
  return app.request(`/api/posts/${postId}/favorite`, {
    method: 'POST',
    headers: { 'X-Anonymous-Id': uid }
  })
}

async function unfavoritePost(postId, uid = userId) {
  return app.request(`/api/posts/${postId}/favorite`, {
    method: 'DELETE',
    headers: { 'X-Anonymous-Id': uid }
  })
}

describe('POST /api/posts/:id/favorite', () => {
  beforeEach(() => {
    resetStore()
  })

  it('收藏后 favoriteCount +1', async () => {
    await createPost('Favorite me')
    const res = await favoritePost(1)
    expect(res.status).toBe(200)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].favoriteCount).toBe(1)
    expect(body[0].hasFavorited).toBe(true)
  })

  it('重复收藏幂等', async () => {
    await createPost('Favorite me')
    await favoritePost(1)
    await favoritePost(1)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].favoriteCount).toBe(1)
  })
})

describe('DELETE /api/posts/:id/favorite', () => {
  beforeEach(() => {
    resetStore()
  })

  it('取消收藏后 favoriteCount -1', async () => {
    await createPost('Favorite me')
    await favoritePost(1)
    const res = await unfavoritePost(1)
    expect(res.status).toBe(200)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].favoriteCount).toBe(0)
    expect(body[0].hasFavorited).toBe(false)
  })

  it('未收藏状态取消收藏无异常', async () => {
    await createPost('Favorite me')
    const res = await unfavoritePost(1)
    expect(res.status).toBe(200)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].favoriteCount).toBe(0)
    expect(body[0].hasFavorited).toBe(false)
  })
})

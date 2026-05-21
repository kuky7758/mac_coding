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

async function likePost(postId, uid = userId) {
  return app.request(`/api/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'X-Anonymous-Id': uid }
  })
}

async function unlikePost(postId, uid = userId) {
  return app.request(`/api/posts/${postId}/like`, {
    method: 'DELETE',
    headers: { 'X-Anonymous-Id': uid }
  })
}

describe('POST /api/posts/:id/like', () => {
  beforeEach(() => {
    resetStore()
  })

  it('点赞后 likeCount +1', async () => {
    await createPost('Like me')
    const res = await likePost(1)
    expect(res.status).toBe(200)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].likeCount).toBe(1)
    expect(body[0].hasLiked).toBe(true)
  })

  it('重复点赞幂等', async () => {
    await createPost('Like me')
    await likePost(1)
    await likePost(1)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].likeCount).toBe(1)
  })
})

describe('DELETE /api/posts/:id/like', () => {
  beforeEach(() => {
    resetStore()
  })

  it('取消点赞后 likeCount -1', async () => {
    await createPost('Like me')
    await likePost(1)
    const res = await unlikePost(1)
    expect(res.status).toBe(200)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].likeCount).toBe(0)
    expect(body[0].hasLiked).toBe(false)
  })

  it('未点赞状态取消点赞无异常', async () => {
    await createPost('Like me')
    const res = await unlikePost(1)
    expect(res.status).toBe(200)

    const getRes = await getPosts()
    const body = await getRes.json()
    expect(body[0].likeCount).toBe(0)
    expect(body[0].hasLiked).toBe(false)
  })
})

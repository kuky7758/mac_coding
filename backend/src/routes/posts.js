import { Hono } from 'hono'
import { createPost, getAllPosts, getLikeCount, getFavoriteCount, hasLiked, hasFavorited } from '../store/memoryStore.js'

const router = new Hono()

router.get('/', (c) => {
  const userId = c.get('userId')
  const all = getAllPosts().map(post => ({
    ...post,
    likeCount: getLikeCount(post.id),
    favoriteCount: getFavoriteCount(post.id),
    hasLiked: hasLiked(post.id, userId),
    hasFavorited: hasFavorited(post.id, userId)
  }))
  return c.json(all)
})

router.post('/', async (c) => {
  const body = await c.req.json()
  const content = body.content?.trim()
  if (!content) {
    return c.json({ error: '内容不能为空' }, 400)
  }
  const post = createPost(content)
  return c.json(post, 201)
})

export default router

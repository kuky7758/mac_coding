import { Hono } from 'hono'
import { favoritePost, unfavoritePost, getFavoriteCount, hasFavorited } from '../store/memoryStore.js'

const router = new Hono()

router.post('/:id/favorite', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  favoritePost(postId, userId)
  return c.json({ favoriteCount: getFavoriteCount(postId), hasFavorited: hasFavorited(postId, userId) })
})

router.delete('/:id/favorite', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  unfavoritePost(postId, userId)
  return c.json({ favoriteCount: getFavoriteCount(postId), hasFavorited: hasFavorited(postId, userId) })
})

export default router

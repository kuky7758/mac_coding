import { Hono } from 'hono'
import { favoritePost, unfavoritePost } from '../store/memoryStore.js'

const router = new Hono()

router.post('/:id/favorite', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  favoritePost(postId, userId)
  return c.json({ success: true })
})

router.delete('/:id/favorite', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  unfavoritePost(postId, userId)
  return c.json({ success: true })
})

export default router

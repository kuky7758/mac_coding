import { Hono } from 'hono'
import { likePost, unlikePost } from '../store/memoryStore.js'

const router = new Hono()

router.post('/:id/like', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  likePost(postId, userId)
  return c.json({ success: true })
})

router.delete('/:id/like', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  unlikePost(postId, userId)
  return c.json({ success: true })
})

export default router

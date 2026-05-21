import { Hono } from 'hono'
import { likePost, unlikePost, getLikeCount, hasLiked } from '../store/memoryStore.js'

const router = new Hono()

router.post('/:id/like', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  likePost(postId, userId)
  return c.json({ likeCount: getLikeCount(postId), hasLiked: hasLiked(postId, userId) })
})

router.delete('/:id/like', (c) => {
  const postId = parseInt(c.req.param('id'))
  const userId = c.get('userId')
  unlikePost(postId, userId)
  return c.json({ likeCount: getLikeCount(postId), hasLiked: hasLiked(postId, userId) })
})

export default router

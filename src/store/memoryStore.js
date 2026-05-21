export const posts = new Map()
export const likes = new Map()
export const favorites = new Map()

let nextId = 1

export function resetStore() {
  posts.clear()
  likes.clear()
  favorites.clear()
  nextId = 1
}

export function createPost(content) {
  const id = nextId++
  const post = { id, content, timestamp: Date.now() }
  posts.set(id, post)
  return post
}

export function getAllPosts() {
  return Array.from(posts.values()).sort((a, b) => b.timestamp - a.timestamp)
}

export function getPost(id) {
  return posts.get(id)
}

export function getLikeCount(postId) {
  let count = 0
  for (const key of likes.keys()) {
    if (key.startsWith(`${postId}:`)) count++
  }
  return count
}

export function getFavoriteCount(postId) {
  let count = 0
  for (const key of favorites.keys()) {
    if (key.startsWith(`${postId}:`)) count++
  }
  return count
}

export function hasLiked(postId, userId) {
  return likes.has(`${postId}:${userId}`)
}

export function hasFavorited(postId, userId) {
  return favorites.has(`${postId}:${userId}`)
}

export function likePost(postId, userId) {
  likes.set(`${postId}:${userId}`, true)
}

export function unlikePost(postId, userId) {
  likes.delete(`${postId}:${userId}`)
}

export function favoritePost(postId, userId) {
  favorites.set(`${postId}:${userId}`, true)
}

export function unfavoritePost(postId, userId) {
  favorites.delete(`${postId}:${userId}`)
}

import { useAnonymousId } from '../composables/useAnonymousId.js'

const BASE_URL = 'http://localhost:3000/api'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Anonymous-Id': useAnonymousId(),
  }
}

async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export function getPosts() {
  return request('/posts')
}

export function createPost(content) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export function likePost(id) {
  return request(`/posts/${id}/like`, {
    method: 'POST',
  })
}

export function unlikePost(id) {
  return request(`/posts/${id}/like`, {
    method: 'DELETE',
  })
}

export function favoritePost(id) {
  return request(`/posts/${id}/favorite`, {
    method: 'POST',
  })
}

export function unfavoritePost(id) {
  return request(`/posts/${id}/favorite`, {
    method: 'DELETE',
  })
}

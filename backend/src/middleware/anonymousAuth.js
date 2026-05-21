export async function anonymousAuth(c, next) {
  let userId = c.req.header('X-Anonymous-Id')
  if (!userId) {
    userId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
    c.header('X-Anonymous-Id', userId)
  }
  c.set('userId', userId)
  await next()
}

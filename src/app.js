import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { anonymousAuth } from './middleware/anonymousAuth.js'
import postsRouter from './routes/posts.js'
import likesRouter from './routes/likes.js'
import favoritesRouter from './routes/favorites.js'

const app = new Hono()

app.use('*', cors())
app.use('/api/*', anonymousAuth)

app.route('/api/posts', postsRouter)
app.route('/api/posts', likesRouter)
app.route('/api/posts', favoritesRouter)

export default app

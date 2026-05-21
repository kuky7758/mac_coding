import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const FRONTEND_URL = 'http://localhost:5177'
const SCREENSHOT_DIR = path.resolve('e2e-screenshots-fullstack')

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

let browser
let page

async function screenshot(name) {
  const file = path.join(SCREENSHOT_DIR, `${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log(`[截图] ${file}`)
  return file
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function run() {
  console.log('=== 轻语全栈端到端测试（点赞/收藏）===')
  console.log('启动 Chrome...')

  browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  // ===== 测试 1：初始空状态 =====
  console.log('\n[测试 1] 初始空状态')
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' })
  await wait(800)
  await screenshot('01-initial-empty')

  const emptyText = await page.$eval('.empty-state', el => el.textContent.trim())
  console.assert(emptyText.includes('还没有内容'), '空状态文字不匹配')
  console.log('✅ 空状态显示正确')

  // ===== 测试 2：发布帖子 =====
  console.log('\n[测试 2] 发布帖子')
  await page.type('textarea', '这是全栈测试帖子')
  await page.click('button')
  await wait(800)
  await screenshot('02-after-publish')

  const postContent = await page.$eval('.post-content', el => el.textContent.trim())
  console.assert(postContent === '这是全栈测试帖子', '帖子内容不匹配')
  console.log('✅ 帖子发布成功')

  // ===== 测试 3：点赞功能 =====
  console.log('\n[测试 3] 点赞')
  const likeBtn = await page.$('.like-btn')
  const likeTextBefore = await page.evaluate(el => el.textContent.trim(), likeBtn)
  console.log('  点赞前:', likeTextBefore)

  await likeBtn.click()
  await wait(500)
  await screenshot('03-after-like')

  const likeTextAfter = await page.$eval('.like-btn', el => el.textContent.trim())
  console.assert(likeTextAfter.includes('1'), `点赞后计数应为1: ${likeTextAfter}`)

  const likeColor = await page.$eval('.like-btn', el => el.style.color)
  console.assert(likeColor === 'rgb(76, 175, 80)' || likeColor === '#4caf50', `点赞后应为绿色: ${likeColor}`)
  console.log('✅ 点赞成功，计数:', likeTextAfter)

  // ===== 测试 4：收藏功能 =====
  console.log('\n[测试 4] 收藏')
  const favBtn = await page.$('.favorite-btn')
  const favTextBefore = await page.evaluate(el => el.textContent.trim(), favBtn)
  console.log('  收藏前:', favTextBefore)

  await favBtn.click()
  await wait(500)
  await screenshot('04-after-favorite')

  const favTextAfter = await page.$eval('.favorite-btn', el => el.textContent.trim())
  console.assert(favTextAfter.includes('1'), `收藏后计数应为1: ${favTextAfter}`)

  const favColor = await page.$eval('.favorite-btn', el => el.style.color)
  console.assert(favColor === 'rgb(76, 175, 80)' || favColor === '#4caf50', `收藏后应为绿色: ${favColor}`)
  console.log('✅ 收藏成功，计数:', favTextAfter)

  // ===== 测试 5：刷新保留 =====
  console.log('\n[测试 5] 刷新页面验证持久化')
  await page.reload({ waitUntil: 'networkidle0' })
  await wait(800)
  await screenshot('05-after-refresh')

  const likeAfterRefresh = await page.$eval('.like-btn', el => el.textContent.trim())
  const favAfterRefresh = await page.$eval('.favorite-btn', el => el.textContent.trim())
  console.assert(likeAfterRefresh.includes('1'), `刷新后点赞计数应为1: ${likeAfterRefresh}`)
  console.assert(favAfterRefresh.includes('1'), `刷新后收藏计数应为1: ${favAfterRefresh}`)
  console.log('✅ 刷新后状态保留:', { like: likeAfterRefresh, favorite: favAfterRefresh })

  // ===== 测试 6：取消点赞 =====
  console.log('\n[测试 6] 取消点赞')
  await page.click('.like-btn')
  await wait(500)
  await screenshot('06-after-unlike')

  const likeAfterUnlike = await page.$eval('.like-btn', el => el.textContent.trim())
  console.assert(likeAfterUnlike.includes('0'), `取消后点赞计数应为0: ${likeAfterUnlike}`)
  console.log('✅ 取消点赞成功，计数:', likeAfterUnlike)

  // ===== 测试 7：取消收藏 =====
  console.log('\n[测试 7] 取消收藏')
  await page.click('.favorite-btn')
  await wait(500)
  await screenshot('07-after-unfavorite')

  const favAfterUnfav = await page.$eval('.favorite-btn', el => el.textContent.trim())
  console.assert(favAfterUnfav.includes('0'), `取消后收藏计数应为0: ${favAfterUnfav}`)
  console.log('✅ 取消收藏成功，计数:', favAfterUnfav)

  // ===== 测试 8：发布第二条帖子验证列表 =====
  console.log('\n[测试 8] 发布第二条帖子')
  await page.type('textarea', '第二条帖子')
  await page.click('button')
  await wait(800)
  await screenshot('08-second-post')

  const posts = await page.$$eval('.post-content', els => els.map(el => el.textContent.trim()))
  console.assert(posts.length === 2, `帖子数量应为2: ${posts.length}`)
  console.assert(posts[0] === '第二条帖子', '新帖应在顶部')
  console.log('✅ 多帖子列表正确:', posts)

  console.log('\n=== 全栈端到端测试全部通过 ✅ ===')
  console.log(`截图保存在: ${SCREENSHOT_DIR}`)
}

run().catch(err => {
  console.error('❌ 测试失败:', err)
  process.exit(1)
}).finally(async () => {
  if (browser) await browser.close()
})

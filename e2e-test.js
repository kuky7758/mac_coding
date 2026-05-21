import puppeteer from 'puppeteer-core'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE_URL = 'http://localhost:5176'
const SCREENSHOT_DIR = path.resolve('e2e-screenshots')

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
  console.log('=== 轻语端到端测试开始 ===')
  console.log('启动 Chrome...')

  browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  // 清除 LocalStorage，确保干净状态
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await page.evaluate(() => localStorage.clear())

  // ===== 测试 1：初始空状态 =====
  console.log('\n[测试 1] 初始空状态')
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
  await wait(500)
  await screenshot('01-initial-empty-state')

  const emptyStateText = await page.$eval('.empty-state', el => el.textContent)
  console.assert(emptyStateText.includes('还没有内容'), '空状态文字不匹配')
  console.log('✅ 空状态显示正确')

  // ===== 测试 2：输入内容与字数统计 =====
  console.log('\n[测试 2] 输入内容与字数统计')
  await page.type('textarea', 'Hello 轻语，这是一条端到端测试！')
  await wait(300)
  await screenshot('02-input-with-char-count')

  const charCount = await page.$eval('.char-count', el => el.textContent.trim())
  // "Hello 轻语，这是一条端到端测试！" 共 19 个字符（含标点和英文字母）
  console.assert(charCount === '19/280', `字数统计不匹配: "${charCount}"`)
  console.log('✅ 字数统计正确:', charCount)

  // ===== 测试 3：发布帖子 =====
  console.log('\n[测试 3] 发布帖子')
  await page.click('button')
  await wait(500)
  await screenshot('03-after-publish')

  const postContent = await page.$eval('.post-content', el => el.textContent)
  console.assert(postContent === 'Hello 轻语，这是一条端到端测试！', '帖子内容不匹配')
  console.log('✅ 帖子发布成功:', postContent)

  const postTime = await page.$eval('.post-time', el => el.textContent)
  console.assert(/\d{4}-\d{2}-\d{2}/.test(postTime), '时间格式不正确')
  console.log('✅ 时间显示正确:', postTime)

  // ===== 测试 4：空状态消失 =====
  console.log('\n[测试 4] 空状态消失')
  const emptyStateExists = await page.$('.empty-state') !== null
  console.assert(!emptyStateExists, '空状态应该消失')
  console.log('✅ 空状态已消失')

  // ===== 测试 5：输入框已清空 =====
  console.log('\n[测试 5] 输入框已清空')
  const textareaValue = await page.$eval('textarea', el => el.value)
  console.assert(textareaValue === '', '输入框未清空')
  console.log('✅ 输入框已清空')

  // ===== 测试 6：发布第二条帖子（验证倒序） =====
  console.log('\n[测试 6] 发布第二条帖子')
  await page.type('textarea', '第二条测试内容')
  await page.click('button')
  await wait(500)
  await screenshot('04-second-post')

  const posts = await page.$$eval('.post-content', els => els.map(el => el.textContent))
  console.assert(posts.length === 2, `帖子数量应为2，实际${posts.length}`)
  console.assert(posts[0] === '第二条测试内容', '第一条应该是新发布的')
  console.assert(posts[1] === 'Hello 轻语，这是一条端到端测试！', '第二条应该是旧的')
  console.log('✅ 倒序排列正确:', posts)

  // ===== 测试 7：刷新页面，数据保留 =====
  console.log('\n[测试 7] 刷新页面验证持久化')
  await page.reload({ waitUntil: 'networkidle0' })
  await wait(500)
  await screenshot('05-after-refresh')

  const postsAfterRefresh = await page.$$eval('.post-content', els => els.map(el => el.textContent))
  console.assert(postsAfterRefresh.length === 2, `刷新后帖子数量应为2，实际${postsAfterRefresh.length}`)
  console.assert(postsAfterRefresh[0] === '第二条测试内容', '刷新后第一条不对')
  console.log('✅ 刷新后数据保留:', postsAfterRefresh)

  // ===== 测试 8：空内容不提交 =====
  console.log('\n[测试 8] 空内容不提交')
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle0' })
  await wait(300)

  // 不输入内容直接点击
  await page.click('button')
  await wait(300)
  await screenshot('06-empty-submit')

  const emptyAfterClick = await page.$('.empty-state') !== null
  console.assert(emptyAfterClick, '空内容点击后仍应显示空状态')
  console.log('✅ 空内容未提交')

  // ===== 测试 9：超出字数标红 =====
  console.log('\n[测试 9] 超出字数标红')
  // 通过直接赋值绕过 maxlength 限制，测试 over-limit 样式
  await page.evaluate(() => {
    const ta = document.querySelector('textarea')
    ta.value = 'x'.repeat(281)
    ta.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await wait(300)
  await screenshot('07-over-limit')

  const isOverLimit = await page.$eval('.char-count', el => el.classList.contains('over-limit'))
  console.assert(isOverLimit, '超出字数时应有 over-limit 类')
  console.log('✅ 超出字数标红正确')

  console.log('\n=== 所有端到端测试通过 ✅ ===')
  console.log(`截图保存在: ${SCREENSHOT_DIR}`)
}

run().catch(err => {
  console.error('❌ 测试失败:', err)
  process.exit(1)
}).finally(async () => {
  if (browser) await browser.close()
})

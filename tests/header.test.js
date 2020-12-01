const Page = require('./helpers/page')

let page

beforeEach(async _ => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async () => await page.close())

test('The header has the correct text', async _ => {
  const text = await page.getContentsOf('a.brand-logo')

  expect(text).toEqual('Blogster')
})

test('Login function', async _ => {
  await page.click('.right a')

  const url = await page.url()

  expect(url).toMatch(/accounts\.google\.com/)
})

test('There should be logout button for auth user', async _ => {
  await page.login()

  const text = await page.getContentsOf('a[href="/auth/logout"]')

  expect(text).toEqual('Logout')
})
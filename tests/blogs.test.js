const Page = require('./helpers/page')

let page

beforeEach(async _ => {
  page = await Page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async _ => await page.close())

describe('when logged in', async _ => {
  beforeEach(async _ => {
    await page.login()
    await page.click('a.btn-floating')
  })

  test('Can see blog create form', async _ => {
    const label = await page.getContentsOf('form label')
    expect(label).toEqual('Blog Title')
  })

  describe('And using valid inputs', async _ => {
    beforeEach(async _ => {
      await page.type('.title input', 'from chrome')
      await page.type('.content input', 'text for chromium')
      await page.click('form button')
    })
    
    test('Submitting takes user to review screen', async _ => {
      const text = await page.getContentsOf('form h5')
      expect(text.toLowerCase()).toEqual('please confirm your entries')
    })

    test('Submitting then adds to new blog to other blogs', async _ => {
      await page.click('button.green')
      await page.waitForSelector('.card')
      const title = await page.getContentsOf('span.card-title')
      const content = await page.getContentsOf('p')
      expect(title.toEqual('first blog'))
      expect(content).toEqual('for testing')
    })
  })

  describe('And using invalid inputs', async _ => {
    beforeEach(async _ => {
      await page.click('form button')
    })

    test('The form show an error message', async _ => {
      const titleError = await page.getContentsOf('.title .red-text')
      const contentError = await page.getContentsOf('.title .red-text')
      expect(titleError.toLowerCase()).toEqual('you must provide a value')
      expect(contentError.toLowerCase()).toEqual('you must provide a value')
    })
  })
})

describe('User is not logged in', async _ => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: { 
        title: 'test', 
        content: 'test' 
      }
    }
  ]

  test('Cannot fetch list of blogs', async _ => {
    const results = await page.exec(actions)
    for (let res of results) expect(res.err).toEqual('You must log in!')
  })
})
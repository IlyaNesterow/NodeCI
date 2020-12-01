const pup = require('puppeteer')
const sessionFactory = require('../factories/session-factory')

class Page {
  static async build(){
    const browser = await pup.launch({ 
      headless: true,
      args: ['--no-sandbox']  
    })

    const page = await browser.newPage()
    const _page = new Page(page)

    return new Proxy(_page, {
      get: function(target, property){
        return target[property] || browser[property] || page[property] 
      }
    })
  }

  constructor(page){
    this.page = page
  }

  async login(){
    const { session, sig } = sessionFactory()
    
    await this.page.setCookie({ name: 'express:sess', value: session })
    await this.page.setCookie({ name: 'express:sess.sig', value: sig })
    await this.page.goto('http://localhost:3000/blogs')
  }

  async getContentsOf(selector){
    return this.page.$eval(selector, el => el.innerHTML)
  }

  get = path => 
    this.page.evaluate(_path => 
      fetch(_path, {
        method: "GET",
        credentials: 'same-origin',
        headers: {
          'content-type': 'application/json'
        }
      }).then(res => res.json()),
      path
    )
  
  post = (path, body) => 
    this.page.evaluate((_path, _body) => 
      fetch(_path, {
        method: "POST",
        credentials: 'same-origin',
        body: JSON.stringify(_body),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => res.json()),
      path, body
    )

  exec = actions => 
    Promise.all(
      actions.map(({ method, path, data }) => 
        this[method](path, data)
      )
    )
}

module.exports = Page
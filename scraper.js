const axios = require('axios')
const cheerio = require('cheerio')

class Scraper {
  constructor (params) {
    this.pages = params.pages
    this.url = null
    this.page = null
    this.$ = null
    this.imageUrls = {}
    this.rootProtocol = params.rootProtocol
    this.rootdomain = params.rootdomain
  }

  async run() {
    for (let i = 0; i < this.pages.length; i++) {
      this.url = this.pages[i]
      console.log(this.url)
      await this.getPage()
      this.parsePage()
      this.scrapePhotos()
    }
    console.log(this.imageUrls)
  }

  async getPage() {
    const req = await axios.get(this.url)
    this.page = req.data
  }

  async parsePage() {
    this.$ = cheerio.load(this.page)
  }

  scrapePhotos() {
    const urls = this.page.match(/([^="'])+\.(jpg|gif|png|jpeg)/gm)
    this.imageUrls[this.url] = [...new Set(urls.map(url => this.formatImageUrl(url)))]
  }

  formatImageUrl(url) {
      if (url.includes('(')) {
        url = url.split('(')[1]
      }
      const protocol = /^(http|https)/.test(url)
      if (protocol) {
        return url
      }
      const noProtocol = url.replace(/^\/\//, '')
      const cleanPath = noProtocol.replace(/^\//, '')
      const isDomain = /\.(com|net|org|biz|ca|info)/.test(cleanPath)
      if (isDomain) {
        return `${this.rootProtocol}://${cleanPath}`
      }
      return `${this.rootdomain}/${cleanPath}`
  }
}

module.exports = Scraper
const axios = require('axios')
const cheerio = require('cheerio')
const parser = require('parse-address')
class Scraper {
  constructor(params) {
    this.pages = params.pages
    this.url = null
    this.page = null
    this.$ = null
    this.imageUrls = {}
    this.rootProtocol = params.rootProtocol
    this.rootdomain = params.rootdomain
    this.template = {
      address: {
        selector: '#address-block'
      }
    }
    // adapted from this regex fround on https://regexlib.com/REDetails.aspx?regexp_id=986
    // this.addressRegex = /^\s*((?:(?:\d+(?:\x20+\w+\.?)+(?:(?:\x20+STREET|ST|DRIVE|DR|AVENUE|AVE|ROAD|RD|LOOP|COURT|CT|CIRCLE|LANE|LN|BOULEVARD|BLVD)\.?)?)|(?:(?:P\.\x20?O\.|P\x20?O)\x20*Box\x20+\d+)|(?:General\x20+Delivery)|(?:C[\\\/]O\x20+(?:\w+\x20*)+))\,?\x20*(?:(?:(?:APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(?:LIP|PC|T(?:E|OP))|TRLR|UNIT|\x23)\.?\x20*(?:[a-zA-Z0-9\-]+))|(?:BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR))?)\,?\s+((?:(?:\d+(?:\x20+\w+\.?)+(?:(?:\x20+STREET|ST|DRIVE|DR|AVENUE|AVE|ROAD|RD|LOOP|COURT|CT|CIRCLE|LANE|LN|BOULEVARD|BLVD)\.?)?)|(?:(?:P\.\x20?O\.|P\x20?O)\x20*Box\x20+\d+)|(?:General\x20+Delivery)|(?:C[\\\/]O\x20+(?:\w+\x20*)+))\,?\x20*(?:(?:(?:APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(?:LIP|PC|T(?:E|OP))|TRLR|UNIT|\x23)\.?\x20*(?:[a-zA-Z0-9\-]+))|(?:BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR))?)?\,?\s+((?:[A-Za-z]+\x20*)+)\,\s+(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)\s*$/
    // this.addressRegex = /(\d+)(?:\x20+[-'0-9A-zÀ-ÿ]+\.?)+?)\,?\x20*?)\-*,?\s+?\,?((?:[A-Za-z]+\x20*)+)\,\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)*/gm
    this.addressRegex = /^\s*(\d+)((?:(?:\x20+[-'0-9A-zÀ-ÿ]+\.?)+?)\,?\x20*?)\-*,?\s+?\,?((?:[A-Za-z]+\x20*)+)\,\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)*/gm
    this.address = null
    this.errors = {}
  }

  async run() {
    for (let i = 0; i < this.pages.length; i++) {
      try {
        this.url = this.pages[i]
        console.log(this.url)
        await this.getPage()
        this.parsePage()
        if (!this.addressFound) {
          this.getAddress()
          console.log(this.address)
        }
        // this.scrapePhotos() 
      } catch (error) {
        this.errors[this.url] = error
      }
    }
    console.log(this.errors)
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
  getAddress() {
    const address = this.$(this.template.address.selector).text().trim().replace(/\r?\n|\r|\t/g, ' ').replace(/\s\s+/g, ' ')
    this.parsedAddress(address)
  }
  parsedAddress(address) {
    const matches = address.match(this.addressRegex)
    this.address = parser.parseLocation(`${matches[0]}-2345`)
  }
}

module.exports = Scraper
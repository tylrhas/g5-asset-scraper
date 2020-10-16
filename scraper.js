const axios = require('axios')
const cheerio = require('cheerio')
const scrapers = require('./scrapers')
class Scraper {
  constructor(params) {
    validate(params)
    this.beforeScrape = []
    this.afterScrape = []
    this.beforePageChange = []
    this.afterPageChange = []
    this.pages = params.pages
    this.url = null
    this.page = null
    this.$ = null
    this.rootProtocol = params.rootProtocol
    this.rootdomain = params.rootdomain
    this.pageSlug = null
    this.scrapers = params.scrapers
    this.returKeys = []
    // this.template = null
    this.template = {
      address: {
        selector: '#address-block'
      },
      phone: {
        selector: '#address-block'
      },
      email: {
        selector: '#address-block'
      },
      amenities: {
        selector: '.row .wp-block-columns .wp-block-column ul li',
        slug: 'features-amenities',
      }
    }
    // adapted from this regex fround on https://regexlib.com/REDetails.aspx?regexp_id=986
    // this.addressRegex = /^\s*((?:(?:\d+(?:\x20+\w+\.?)+(?:(?:\x20+STREET|ST|DRIVE|DR|AVENUE|AVE|ROAD|RD|LOOP|COURT|CT|CIRCLE|LANE|LN|BOULEVARD|BLVD)\.?)?)|(?:(?:P\.\x20?O\.|P\x20?O)\x20*Box\x20+\d+)|(?:General\x20+Delivery)|(?:C[\\\/]O\x20+(?:\w+\x20*)+))\,?\x20*(?:(?:(?:APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(?:LIP|PC|T(?:E|OP))|TRLR|UNIT|\x23)\.?\x20*(?:[a-zA-Z0-9\-]+))|(?:BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR))?)\,?\s+((?:(?:\d+(?:\x20+\w+\.?)+(?:(?:\x20+STREET|ST|DRIVE|DR|AVENUE|AVE|ROAD|RD|LOOP|COURT|CT|CIRCLE|LANE|LN|BOULEVARD|BLVD)\.?)?)|(?:(?:P\.\x20?O\.|P\x20?O)\x20*Box\x20+\d+)|(?:General\x20+Delivery)|(?:C[\\\/]O\x20+(?:\w+\x20*)+))\,?\x20*(?:(?:(?:APT|BLDG|DEPT|FL|HNGR|LOT|PIER|RM|S(?:LIP|PC|T(?:E|OP))|TRLR|UNIT|\x23)\.?\x20*(?:[a-zA-Z0-9\-]+))|(?:BSMT|FRNT|LBBY|LOWR|OFC|PH|REAR|SIDE|UPPR))?)?\,?\s+((?:[A-Za-z]+\x20*)+)\,\s+(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)\s*$/
    // this.addressRegex = /(\d+)(?:\x20+[-'0-9A-zÀ-ÿ]+\.?)+?)\,?\x20*?)\-*,?\s+?\,?((?:[A-Za-z]+\x20*)+)\,\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)*/gm
    this.errors = {}
  }
  includeScrapers () {
    Object.keys(this.scrapers)
      .forEach((key) => {
        if (this.scrapers[key]) scrapers[key](this)
      })
  }
  addScraper(hookName, func) {
    this[hookName].push(func)
  }
  addProp(propName, value, returnProp = false){
      this[propName] = value
      if (returnProp) this.returKeys.push(propName)
  }
  async runBeforeScrape() {
    for (let i = 0 ; i < this.beforeScrape.length; i++) {
      await this.beforeScrape[i](this)
    }
  }
  async runAfterScrape() {
    for (let i = 0 ; i < this.afterScrape.length; i++) {
      this.afterScrape[i](this)
    }
  }
 async runBeforePageChange() {
    for (let i = 0 ; i < this.beforePageChange.length; i++) {
      await this.beforePageChange[i](this)
    }
  }
  async runAfterPageChange() {
    for (let i = 0 ; i < this.afterPageChange.length; i++) {
      await this.afterPageChange[i](this)
    }
  }
  async run() {
    this.includeScrapers()
    await this.runBeforeScrape()
    for (let i = 0; i < this.pages.length; i++) {
      await this.runBeforePageChange()
      try {
        this.url = this.pages[i]
        const splitUrl = this.url.split('/')
        this.pageSlug = splitUrl[splitUrl.length -1] === '' ? splitUrl[splitUrl.length -2].trim() : splitUrl[splitUrl.length -1].trim()
        console.log(this.pageSlug)
        await this.getPage()
        this.parsePage()
        await this.runAfterPageChange()
      } catch (error) {
        this.errors[this.url] = error
      }
    }
    await this.runAfterScrape()
    // console.log(this)
  }
  async getPage() {
    const req = await axios.get(this.url)
    this.page = req.data
  }

  async parsePage() {
    this.$ = cheerio.load(this.page)
  }

  results() {
    const result = {
      errors: this.errors
    }
    this.returKeys.forEach(key => result[key] = this[key])
    return result
  }
}
function validate (params) {
  console.log(params)
  if (!params.rootProtocol && (params.rootProtocol !== 'https' || params.rootProtocol !== 'http')) throw new Error('rootProtocol must be set and be either http or https')
  if (!params.pages && Array.isArray(params.pages) && params.pages.length === 0) throw new Error('pages must be a non-empty array')
  if (!params.scrapers && (typeof params.scrapers === 'object') && yourVariable !== null) throw new Error ('scrapers must be an array of')
  if (!params.rootdomain && (typeof params.rootdomain === 'string') && params.rootdomain === "") throw new Error('rootdomain must be set and a string') 
}
module.exports = Scraper
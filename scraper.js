const axios = require('axios')
const cheerio = require('cheerio')
const scrapers = require('./scrapers')
const { PubSub } = require('@google-cloud/pubsub');
const { GCP_PROJECT_ID: projectId } = process.env
class Scraper {
  constructor(params) {
    this.validate(params)
    this.topicName = params.topicName
    this.pubSubClient = new PubSub({ projectId })
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
    this.template = params.template
    this.complete = false
    this.errors = {}
  }
  includeScrapers () {
    Object.keys(this.scrapers)
      .forEach((key) => {
        if (this.scrapers[key]) scrapers[key](this)
      })
  }
  // hookname is string, func will always be function
  addScraper(hookName, func) {
    if (this[hookName] === undefined || typeof hookName !== 'string' || typeof func !== 'function') {
      throw new Error('bad params: addScraper function')
    }
    this[hookName].push(func)
  }
  // propName always string, value doesnt need to be typechecked, boolean
  addProp(propName, value, returnProp = false) {
    if (typeof propName !== 'string' || typeof returnProp !== 'boolean') {
      throw new Error('bad params: addProp function')
    }
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
      await this.afterScrape[i](this)
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

  async sendBuffer(pageIndex, log, results, errors) {
    const progress = pageIndex + 1 / this.pages.length
    const dataBuffer = Buffer.from(JSON.stringify({
      progress,
      complete: this.complete,
      log,
      results,
      errors
     }))
     console.log(dataBuffer, typeof dataBuffer)
     await this.pubSubClient.topic(this.topicName)
      .publish({data: dataBuffer, orderingKey: 'assetScraper' })
  }

  async run() {
    this.includeScrapers()
    await this.runBeforeScrape()
    for (let i = 0; i < this.pages.length; i++) {
      await this.runBeforePageChange()
      try {
        await this.sendBuffer(i, this.pages[i], null, null)
        this.url = this.pages[i]
        const splitUrl = this.url.split('/').filter(val => val)
        this.pageSlug = splitUrl[splitUrl.length -1]
        await this.getPage()
        this.parsePage()
        await this.runAfterPageChange()
      } catch (error) {
        this.errors[this.url] = error
        await this.sendBuffer(i, null, null, error)
      }
    }
    await this.runAfterScrape()
    this.complete = true
    const results = this.results()
    await this.sendBuffer(1, null, results, null)
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

  validate (params) {
    if (!params.rootProtocol || (params.rootProtocol !== 'https' && params.rootProtocol !== 'http')) throw new Error('rootProtocol must be set and be either http or https')
    if (!params.pages || !Array.isArray(params.pages) || params.pages.length === 0) throw new Error('pages must be a non-empty array')
    if (!params.scrapers || typeof params.scrapers !== 'object') throw new Error ('scrapers must be an object')
    if (!params.rootdomain || (typeof params.rootdomain !== 'string') || params.rootdomain === "") throw new Error('rootdomain must be set and a string') 
  }
}

module.exports = Scraper
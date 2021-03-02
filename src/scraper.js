const axios = require('axios')
const cheerio = require('cheerio')
const scrapers = require('./scrapers')
// const { PubSub } = require('@google-cloud/pubsub')
// const { GCP_PROJECT_ID: projectId } = process.env

module.exports = Scraper

/**
 * Scrapes websites for assets (address, imeages, amentiies, emails)
 * @class Scraper
 */
class Scraper {
  constructor(params) {
    this.validate(params)
    this.topicName = params.topicName || null
    // this.pubSubClient = new PubSub({ projectId })
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
    this.config = params.config
    this.errors = {}
  }

  includeScrapers () {
    Object.keys(this.scrapers)
      .forEach((key) => {
        if (this.scrapers[key]) scrapers[key](this)
      })
  }

  /**
   * @memberof Scraper
   * @param {String} hookName 
   * @param {Function} func 
   */
  addScraper (hookName, func) {
    if (this[hookName] === undefined || typeof hookName !== 'string' || typeof func !== 'function') {
      throw new Error('bad params: addScraper function')
    }
    this[hookName].push(func)
  }

  /**
   * @memberof Scraper
   * @param {String} propName 
   * @param {*} value 
   * @param {Boolean} returnProp 
   */
  addProp (propName, value, returnProp = false) {
    if (typeof propName !== 'string' || typeof returnProp !== 'boolean') {
      throw new Error('bad params: addProp function')
    }
    this[propName] = value
    if (returnProp) this.returKeys.push(propName)
  }

  /**
   * @memberof Scraper
   */
  async runBeforeScrape () {
    for (let i = 0 ; i < this.beforeScrape.length; i++) {
      await this.beforeScrape[i](this)
    }
  }

  /**
   * @memberof Scraper
   */
  async runAfterScrape () {
    for (let i = 0 ; i < this.afterScrape.length; i++) {
      await this.afterScrape[i](this)
    }
  }

  /**
   * @memberof Scraper
   */
  async runBeforePageChange () {
    for (let i = 0 ; i < this.beforePageChange.length; i++) {
      await this.beforePageChange[i](this)
    }
  }

  /**
   * @memberof Scraper
   */
  async runAfterPageChange () {
    for (let i = 0 ; i < this.afterPageChange.length; i++) {
      try {
        await this.afterPageChange[i](this) 
      } catch (error) {
        console.log(error)
      }
    }
  }

  // sendBuffer (pageIndex, log, results, errors) {
  //   const progress = Math.floor((pageIndex + 1) / this.pages.length)
  //   const dataBuffer = Buffer.from(JSON.stringify({
  //     progress,
  //     complete: this.complete,
  //     log,
  //     results,
  //     errors
  //    }))
  //    this.pubSubClient.topic(this.topicName, { enableMessageOrdering: true })
  //     .publishMessage({data: dataBuffer, orderingKey: 'assetScraper' })
  // }

  /**
   * @memberof Scraper
   * @returns 
   */
  getPageSlug () {
    const splitUrl = this.url.split('/').filter(val => val)
    return splitUrl[splitUrl.length -1]
  }

  /**
   * @memberof Scraper
   */
  async run () {
    this.includeScrapers()
    await this.runBeforeScrape()
    for (let i = 0; i < this.pages.length; i++) {
      await this.runBeforePageChange()
      try {
        // if (this.topicName) {
        //   this.sendBuffer(i, this.pages[i], null, null)
        // }
        this.url = this.pages[i]
        this.pageSlug = this.getPageSlug()
        await this.getPage()
        this.parsePage()
        await this.runAfterPageChange()
      } catch (error) {
        this.errors[this.url] = error
        // if (this.topicName) {
        //   this.sendBuffer(i, null, null, error)
        // }
      }
    }
    await this.runAfterScrape()
    this.complete = true
    // if (this.topicName) {
    //   const results = this.results()
    //   this.sendBuffer(1, null, results, null)
    // }
  }

  /**
   * @memberof Scraper
   */
  async getPage () {
    const req = await axios.get(this.url)
    this.page = req.data
  }

  /**
   * @memberof Scraper
   */
  async parsePage () {
    this.$ = cheerio.load(this.page)
  }

  /**
   * @memberof Scraper
   * @returns 
   */
  results () {
    const result = {
      errors: this.errors
    }
    this.returKeys.forEach(key => result[key] = this[key])
    return result
  }

  /**
   * @memberof Scraper
   * @param {Object} params 
   */
  validate (params) {
    if (!params.rootProtocol || (params.rootProtocol !== 'https' && params.rootProtocol !== 'http')) throw new Error('rootProtocol must be set and be either http or https')
    if (!params.pages || !Array.isArray(params.pages) || params.pages.length === 0) throw new Error('pages must be a non-empty array')
    if (!params.scrapers || typeof params.scrapers !== 'object') throw new Error ('scrapers must be an object')
    if (!params.rootdomain || (typeof params.rootdomain !== 'string') || params.rootdomain === "") throw new Error('rootdomain must be set and a string') 
  }
}
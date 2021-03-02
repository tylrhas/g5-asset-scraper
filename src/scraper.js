import https from 'https'
import axios from 'axios'
import { load } from 'cheerio'
import scrapers from './scrapers'

/**
 * Scrapes websites for assets
 * @class Scraper
 */
class Scraper {
  constructor(params) {
    this.validate(params)
    this.topicName = params.topicName || null
    this.beforeScrape = []
    this.afterScrape = []
    this.beforePageChange = []
    this.afterPageChange = []
    this.pages = params.pages
    this.url = null
    this.page = null
    this.$ = null
    this.rootProtocol = params.rootProtocol
    this.rootDomain = params.rootDomain
    this.pageSlug = null
    this.scrapers = params.scrapers
    this.returKeys = []
    this.template = params.template
    this.complete = false
    this.config = params.config
    this.errors = {}
  }

  /**
   * @memberof Scraper
   */
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
        this.url = this.pages[i]
        this.pageSlug = this.getPageSlug()
        await this.getPage()
        this.parsePage()
        await this.runAfterPageChange()
      } catch (error) {
        this.errors[this.url] = error
      }
    }
    await this.runAfterScrape()
    this.complete = true
  }

  /**
   * @memberof Scraper
   */
  async getPage () {
    const req = await axios.get(this.url, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    this.page = req.data
  }

  /**
   * @memberof Scraper
   */
  async parsePage () {
    this.$ = load(this.page)
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
    if (!params.rootDomain || (typeof params.rootDomain !== 'string') || params.rootDomain === '') {
      throw new Error('The "rootDomain" must be Set and be typeof String.')
    }
  }
}

export default Scraper

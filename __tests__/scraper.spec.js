const Scraper = require('../scraper')
const mockAxios = require('axios')
const html = require('./config/html')
const params = require('./config/params')

describe('Scraper class', () => {

  let scraper
  beforeEach(() => {
    scraper = new Scraper(params)
  })

  test('invalid constructor params', () => {
    expect(() => {
      new Scraper({ rootProtocol: null })
    }).toThrow('rootProtocol must be set and be either http or https')
    expect(() => {
      new Scraper({ rootProtocol: 'https', pages: [] })
    }).toThrow('pages must be a non-empty array')
    expect(() => {
      new Scraper({ rootProtocol: 'https', pages: ['https://solaire8250.com/floor-plans/'], scrapers: null })
    }).toThrow('scrapers must be an object')
    expect(() => {
      new Scraper({ rootProtocol: 'https', pages: ['https://solaire8250.com/floor-plans/'], scrapers: {}, rootdomain: '' })
    }).toThrow('rootdomain must be set and a string')
    expect(() => {
      new Scraper({ rootProtocol: 'https', pages: ['https://solaire8250.com/floor-plans/'], scrapers: {}, rootdomain: 1 })
    }).toThrow('rootdomain must be set and a string')
    expect(() => {
      new Scraper({ rootProtocol: 'https', pages: ['https://solaire8250.com/floor-plans/'], scrapers: {}, rootdomain: null })
    }).toThrow('rootdomain must be set and a string')
    
  })

  test('constructor prop tests', () => {
    expect(scraper.beforeScrape).toEqual([])
    expect(scraper.afterScrape).toEqual([])
    expect(scraper.beforePageChange).toEqual([])
    expect(scraper.afterPageChange).toEqual([])
    expect(Array.isArray(scraper.pages)).toEqual(true)
    expect(scraper.pages.length > 0).toEqual(true)
    expect(scraper.url).toEqual(null)
    expect(scraper.page).toEqual(null)
    expect(scraper.$).toEqual(null)
    expect(scraper.rootProtocol).toEqual('https' || 'http')
    expect(typeof scraper.rootdomain).toEqual('string')
    expect(scraper.pageSlug).toEqual(null)
    expect(typeof scraper.scrapers).toEqual('object')
    expect(Object.keys(scraper.scrapers).length > 0).toEqual(true)
    expect(scraper.returKeys).toEqual([])
    expect(typeof scraper.template).toEqual('object')
    expect(scraper.errors).toEqual({})
  })

  test('includeScrapers', () => {
    scraper.includeScrapers() // set state bofore assertions
    expect(scraper.addressRegex instanceof RegExp).toEqual(true)
    expect(scraper.emailRegex instanceof RegExp).toEqual(true)
    expect(scraper.phoneRegex instanceof RegExp).toEqual(true)
    expect(scraper.afterPageChange.length).toEqual(Object.keys(scraper.scrapers).length)
    expect(scraper.afterPageChange.every(func => typeof func === 'function')).toEqual(true)
    expect(scraper.afterScrape.every(func => typeof func === 'function')).toEqual(true)
    expect(Array.isArray(scraper.returKeys)).toEqual(true)
  })

  test('addScraper', () => {  
    //test passing
    const func = (x) => x + x
    scraper.addScraper('beforeScrape', func) 
    expect(scraper.beforeScrape[0]).toEqual(func)
    expect(typeof scraper.beforeScrape[0]).toEqual('function')
    // test failing
    expect(() => { //not a real hook name
     scraper.addScraper('notAHookName', func)
    }).toThrow('bad params: addScraper function')
    expect(() => { //bad 1st param val
      scraper.addScraper(1, func)
    }).toThrow('bad params: addScraper function')
    expect(() => { //bad 2nd param val
      scraper.addScraper('beforeScrape', {})
    }).toThrow('bad params: addScraper function')
  })

  test('addProp', () => {  
    //test passing
    scraper.addProp('testProp', 123, true) 
    expect(scraper.testProp).toEqual(123)
    expect(scraper.returKeys.includes('testProp')).toEqual(true)

    scraper.addProp('testProp2', 123, false) 
    expect(scraper.returKeys.includes('testProp2')).toEqual(false)
    // test failing
    expect(() => { //bad 1st param val
      scraper.addProp(1, 123, false)
    }).toThrow('bad params: addProp function')
    expect(() => { //bad 3rd param val
      scraper.addProp('helloWorld', 123, {})
    }).toThrow('bad params: addProp function')
  })
})

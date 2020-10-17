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
    
  }),

  test('constructor prop tests', () => {
    expect(scraper.beforeScrape).toEqual([])
    expect(scraper.afterScrape).toEqual([])
    expect(scraper.beforePageChange).toEqual([])
    expect(scraper.afterPageChange).toEqual([])
    expect(scraper.pages).toEqual([
      "https://solaire8250.com/floor-plans/",
      "https://solaire8250.com/",
      "https://solaire8250.com/#welcomearea",
      "https://solaire8250.com/features-amenities/",
      "https://solaire8250.com/neighborhood/",
      "https://solaire8250.com/floor-plans/",
      "https://solaire8250.com/contact-us/",
      "https://solaire8250.com/privacy-policy/",
      "https://solaire8250.com/gallery/",
      "https://schedule.tours/kettler/solaire-8250-georgia/schedule",
      "https://solaire8250.com/virtual-tours/"
    ])
    expect(scraper.url).toEqual(null)
    expect(scraper.page).toEqual(null)
    expect(scraper.$).toEqual(null)
    expect(scraper.rootProtocol).toEqual('https')
    expect(scraper.rootdomain).toEqual('solaire8250.com')
    expect(scraper.pageSlug).toEqual(null)
    expect(scraper.scrapers).toEqual({
      "photos": true,
      "amenities": true,
      "address": true,
      "emails": true,
      "phoneNumber": true
    })
    expect(scraper.returKeys).toEqual([])
    expect(scraper.template).toEqual({
      "address": {
        "selector": "#address-block"
      },
      "phone": {
        "selector": "#address-block"
      },
      "email": {
        "selector": "#address-block"
      },
      "amenities": {
        "selector": ".row .wp-block-columns .wp-block-column ul li",
        "slug": "features-amenities"
      }
    })
    expect(scraper.errors).toEqual({})
  })

  test('includeScrapers', () => {
    expect(scraper.addressRegex).toEqual(/\\s*(\\d+)((?:(?:\\x20+[-'0-9A-zÀ-ÿ]+\\.?)+?)\\,?\\x20*?)\\-*,?\\s+?\\,?((?:[A-Za-z]+\\x20*)+)\\,\\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\\s+(\\d+(?:-\\d+)?)*/gm)
    expect(scraper.afterPageChange.length).toEqual(Object.keys(scraper.scrapers).length)
  })
})

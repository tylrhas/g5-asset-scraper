const scrapers = require('../../scrapers')

describe('Phone Scraper' , () => {

  let Scraper
  beforeEach(() => {
    Scraper = {
      $: cheerio.load(`<p class="here">123-456-7890</p> <p>123-456-7899</p> <p>123-456-7899</p>`),
      addScraper: jest.fn(),
      addProp: jest.fn(),
      phoneNumbers: {},
      phoneRegex: /((\(\d{3}\)?)|(\d{3}))([\s-./]?)(\d{3})([\s-./]?)(\d{4})/gm
      }
  })
  const cheerio = require('cheerio')
  const { init, scrapePhoneNumbers } = require('../../scrapers/phoneNumber')
  test('AddScraper Called with function', () => {
    init(Scraper)
    expect(Scraper.addScraper).toHaveBeenCalledWith('afterPageChange', scrapePhoneNumbers)
  })

  test('Find Email No Template', () => {
    scrapePhoneNumbers(Scraper)
    expect(Scraper.phoneNumbers).toEqual({ '123-456-7899': { count: 2 } , '123-456-7890': { count: 1 }})
  })

  test('Find Email with Template', () => {
    Scraper.template = { phone : { selector: 'p.here' } }
    scrapers.emails = {}
    scrapePhoneNumbers(Scraper)
    expect(Scraper.phoneNumbers).toEqual({ '123-456-7890': { count: 1 } })
  })
})

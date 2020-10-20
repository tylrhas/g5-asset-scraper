const scrapers = require('../../scrapers')

describe('Address Scraper' , () => {

  let Scraper
  beforeEach(() => {
    Scraper = {
      $: cheerio.load(`<p class="here">test@gmail.com</p> <p>test2@gmail.com</p>`),
      addScraper: jest.fn(),
      addProp: jest.fn(),
      emails: {},
      emailRegex: /([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/gm
      }
  })
  const cheerio = require('cheerio')
  const { init, getEmails } = require('../../scrapers/emails')
  // test('AddScraper Called with function', () => {
  //   init(Scraper)
  //   expect(Scraper.addScraper).toHaveBeenCalledWith('afterPageChange', getEmails)
  // })

  test('Find Email No Template', () => {
    getEmails(Scraper)
    expect(Scraper.emails).toEqual({ 'test@gmail.com': { count: 1 } , 'test2@gmail.com': { count: 1 }})
  })

  test('Find Email with Template', () => {
    Scraper.template = { email : { selector: 'p.here' } }
    scrapers.emails = {}
    getEmails(Scraper)
    expect(Scraper.emails).toEqual({ 'test@gmail.com': { count: 1 } })
  })
})

const Scraper = require('../scraper')
const mockAxios = require('axios')
const html = require('./config/html')
const params = require('./config/params')

describe('Scraper class', () => {

  const scraper = new Scraper(params)

  test('constructor prop tests', () => {
    expect(scraper.beforeScrape).toEqual([])

  })
})

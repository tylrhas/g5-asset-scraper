const jestConfig = require('../../jest.config')

describe('Scrapers', () => {
  const index = require('../../scrapers')
  const Scraper = {
    addScraper: jest.fn(),
    addProp: jest.fn()
  } 
  describe('index', () => {
    test('Index file returns an object', () => {
      const type = typeof index
      expect(type).toBe('object')
    })
    test('All Scrapers Call addScraper', () => {
      const keys = Object.keys(index)
      keys.forEach(key => {
        index[key](Scraper)
        expect(Scraper.addScraper).toHaveBeenCalled()
      })
    })
  })
})
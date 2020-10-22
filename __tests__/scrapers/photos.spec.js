const scrapers = require('../../scrapers')

 
describe('Photos Scraper' , () => {
  const cheerio = require('cheerio')
  const { init, uploadPhotos, scrapePhotos, formatImageUrl } = require('../../scrapers/photos')
  beforeEach(() => {
    Scraper = {
      addScraper: jest.fn(),
      addProp: jest.fn(),
      pageSlug: 'amenities',
      template: {},
      imageUrls: {},
      url: 'testing.com'
      }
  })

  test('AddScraper Called with function', () => {
    init(Scraper)
    expect(Scraper.addScraper).toHaveBeenCalledWith('afterPageChange', scrapePhotos)
  })

  test('Scrape Photos', () => {
    Scraper.page = '<p><img src="https://test.com/testing.jpg"></p>'
    scrapePhotos(Scraper)
    expect(Scraper.imageUrls).toEqual({ 'https://test.com/testing.jpg': [ 'testing.com' ] })
  })
  test('Format Urls', () => {
    const url = formatImageUrl('https://test.com/testing.jpg', "https", 'test.com')
    const url2 = formatImageUrl('background-image: url(https://test.com/testing.jpg)', "https", 'test.com')
    const url3 = formatImageUrl('//test.com/testing.jpg', "https", 'test.com')
    const url4 = formatImageUrl('/testing.jpg', "https", 'test.com')
    expect(url).toEqual('https://test.com/testing.jpg')
    expect(url2).toEqual('https://test.com/testing.jpg')
    expect(url3).toEqual('https://test.com/testing.jpg')
    expect(url4).toEqual('https://test.com/testing.jpg')
  })

  test('Upload Photo', () => {
    Scraper.imageUrls = { 'https://test.com/testing.jpg': [ 'testing.com' ] }
    console.log(Scraper.imageUrls)
    // jest.spyOn(require('../../scrapers/photos'), 'upload').mockImplementation(() => jest.fn())
    // uploadPhotos()
  })
})
describe('Address Scraper' , () => {
  const rewire = require('rewire')
  const address = rewire('../../scrapers/address')
  const parsedAddress = address.__get__('parsedAddress')
  const getAddress = address.__get__('getAddress')
  const Scraper = {
    addScraper: jest.fn(),
    addProp: jest.fn()
  } 
  test('AddScraper Called with function', () => {
    address(Scraper)
    expect(Scraper.addScraper).toHaveBeenCalledWith('afterPageChange', getAddress)
  })

  
})

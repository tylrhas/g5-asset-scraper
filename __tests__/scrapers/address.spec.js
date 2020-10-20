describe('Address Scraper' , () => {
  const rewire = require('rewire')
  const a = require('../../scrapers/address')
  const address = rewire(a)
  const cheerio = require('cheerio')
  const parsedAddress = address.__get__('parsedAddress')
  const getAddress = address.__get__('getAddress')
  const Scraper = {
    addScraper: jest.fn(),
    addProp: jest.fn(),
    address: null,
    addressRegex: /\s*(\d+)((?:(?:\x20+[-'0-9A-zÀ-ÿ]+\.?)+?)\,?\x20*?)\-*,?\s+?\,?((?:[A-Za-z]+\x20*)+)\,\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)*/gm
  } 
  test('AddScraper Called with function', () => {
    address(Scraper)
    expect(Scraper.addScraper).toHaveBeenCalledWith('afterPageChange', getAddress)
  })

  test('Find Address', () => {
    Scraper.addScraper = (hook, f) => (getAddress = f)
    Scraper.$ = cheerio.load(`<p>4560 S Balsam Way  Denver, CO 80123</p>`)
    getAddress(Scraper)
    expect(Scraper.address).toEqual({
      number: '4560',
      prefix: 'S',
      street: 'Balsam',
      type: 'Way',
      city: 'Denver',
      state: 'CO',
      zip: '80123'
    })
  })

  test('Parses Address', () => {
    const a = parsedAddress([`4560 S Balsam Way  Denver, CO 80123`])
    expect(a).toEqual({
      number: '4560',
      prefix: 'S',
      street: 'Balsam',
      type: 'Way',
      city: 'Denver',
      state: 'CO',
      zip: '80123'
    })
  })

  test('No Address', () => {
    Scraper.$ = cheerio.load(`<p></p>`)
    getAddress(Scraper)
    expect(Scraper.address).toEqual(null)
  })

})

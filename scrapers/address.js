const parser = require('parse-address')
module.exports = (Scraper) => {
  Scraper.addProp('addressRegex', /\s*(\d+)((?:(?:\x20+[-'0-9A-zÀ-ÿ]+\.?)+?)\,?\x20*?)\-*,?\s+?\,?((?:[A-Za-z]+\x20*)+)\,\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)*/gm, false)
  Scraper.addProp('address', null, true)

  Scraper.addScraper('afterPageChange', getAddress)
}

function getAddress(scraper) {
  const addresses =  scraper.$(scraper.template ? scraper.template.address.selector : 'body').text()
  const matches = addresses.match(scraper.addressRegex)
  scraper.address = parsedAddress(matches)
}

function parsedAddress(address) {
  return address ? parser.parseLocation(address[0].replace(/\r?\n|\r|\t/g, ' ').replace(/\s\s+/g, ' ').trim()) : address
}

const parser = require('parse-address')
module.exports = {
  init,
  getAddress,
  parsedAddress
}
function init(Scraper) {
  // const streetRegex = /^\d+\s[A-z]+\s[A-z]+/g
  // Scraper.addProp('addressRegex', /\s*(\d+)((?:(?:\x20+[-'0-9A-zÀ-ÿ]+\.?)+?)\,?\x20*?)\-*,?\s+?\,?((?:[A-Za-z]+\x20*)+)\,\s(A[LKSZRAP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])\s+(\d+(?:-\d+)?)*/gm, false)
  // Scraper.addProp('address', null, true)

  // Scraper.addScraper('afterPageChange', getAddress)
}

function getAddress(scraper) {
  const addresses = scraper.$(scraper.template.address.selector ? scraper.template.address.selector : 'body').text()
  const arrAddresses = addresses.replace(/\s\s+/gm, ' ')
    .match(/.{0,50}\b\d{5}(?:-\d{4})?\b/g)
  if (arrAddresses.length > 0) {
    arrAddresses.forEach(address => {
      const matches = address.match(scraper.addressRegex)
      if (matches) {
        scraper.address = parsedAddress(matches)
      }
    });
  }
}

function parsedAddress(address) {
  return address ? parser.parseLocation(address[0].replace(/\r?\n|\r|\t/g, ' ').replace(/\s\s+/g, ' ').trim()) : address
}

module.exports = {
  init,
  scrapePhoneNumbers
}
function init (Scraper) {
  Scraper.addProp('phoneNumbers', {}, true)
  Scraper.addProp('phoneRegex', /((\(\d{3}\)?)|(\d{3}))([\s-./]?)(\d{3})([\s-./]?)(\d{4})/gm, false)
  Scraper.addScraper('afterPageChange', scrapePhoneNumbers)
}

function scrapePhoneNumbers(scraper) {
  const phones = scraper.$(scraper.template.address.selector ? scraper.template.phone.selector : 'body').text()
  const matched = phones.match(scraper.phoneRegex)
  if (matched) {
    matched.forEach((p) => { 
      if (!scraper.phoneNumbers[p]) {
        scraper.phoneNumbers[p] = { count: 0 }
      }
      scraper.phoneNumbers[p].count++
    })
  }
}
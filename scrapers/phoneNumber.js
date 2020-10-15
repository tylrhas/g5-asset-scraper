module.exports = (Scraper) => {
  Scraper.addProp('phoneNumbers', {})
  Scraper.addProp('phoneRegex', /((\(\d{3}\)?)|(\d{3}))([\s-./]?)(\d{3})([\s-./]?)(\d{4})/gm)
  Scraper.addScraper('afterPageChange', scrapePhoneNumbers)
}

function scrapePhoneNumbers(scraper) {
  const phones = scraper.$(scraper.template ? scraper.template.phone.selector : 'body').text()
  const matched = phones.match(scraper.phoneRegex)
  matched.forEach((p) => { 
    if (!scraper.phoneNumbers[p]) {
      scraper.phoneNumbers[p] = { count: 0 }
    }
    scraper.phoneNumbers[p].count++
  })
}
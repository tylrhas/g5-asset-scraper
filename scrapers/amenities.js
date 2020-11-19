module.exports = {
  init,
  getAmenities
}

function init (Scraper) {
  Scraper.addProp('amenities', {}, true)
  Scraper.addScraper('afterPageChange', getAmenities)
}

function getAmenities(scraper) {
  if (scraper.template.address.selector && scraper.template.amenities.slug === scraper.pageSlug) {
     scraper.amenities = scraper.$(scraper.template.amenities.selector).map((i, el) => scraper.$(el).text()).get()
  }
}
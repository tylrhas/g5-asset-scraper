module.exports = {
  init,
  getAmenities
}

function init (Scraper) {
  Scraper.addProp('amenities', {}, true)
  Scraper.addScraper('afterPageChange', getAmenities)
}

function getAmenities(scraper) {
  if (scraper.template && scraper.template.amenities.slug === scraper.pageSlug) {
     scraper.amenities = scraper.$(scraper.template.amenities.selector).map((i, el) => {
      return scraper.$(el).text().replace(/\s\s+/gm, ' ').trim()
     }).get().filter(a => a)
  }
}
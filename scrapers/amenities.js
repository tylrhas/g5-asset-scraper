module.exports = (Scraper) => {
  Scraper.addProp('imageUrls', {})
  Scraper.addScraper('afterPageChange', getAmenities)
}

function getAmenities(scraper) {
  if (scraper.template && scraper.template.amenities.slug === scraper.pageSlug) {
     scraper.amenities = scraper.$(scraper.template.amenities.selector).map((i, el) => scraper.$(el).text()).get()
  }
}
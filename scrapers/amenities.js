const amenitiesConfig = require('../config/amenities')
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
  } else {
    // add to scraper.amenities
    const copy = getCopy(scraper.$)
    for (const [category, items] of Object.entries(amenitiesConfig[scraper.vertical])) {
      scraper.amenities[category] = scraper.amenities[category] ? scraper.amenities[category] : []
      for (const [amenity, settings] of Object.entries(items)) {
        const amenities = [amenity, ...settings.variants]
        const hasAmenity = keywordMatch(amenities, copy)
        if (hasAmenity) {
          scraper.amenities[category].push(amenity)
        }
      }
    }
  }
}

function getCopy($) {
  return $('*')
    .each(function () {
      $(this).append(' ')
    })
    .find('p, li, span, option, form, button, input, header, .btn')
    .text()
    .replace(/\s\s+/g, ' ')
}

function buildRegexPattern(keywords) {
  const string = keywords.map(word => `(?:^|\\b)${word}s?(?:$|\\b)`)
    .join('|')
  return new RegExp(string, 'gi')
}

//returns boolean
function keywordMatch(keywords, copy) {
  const pattern = buildRegexPattern(keywords)
  return pattern.test(copy)
}
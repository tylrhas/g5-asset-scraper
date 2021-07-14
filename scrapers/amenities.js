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
    const copy = getCopy(scraper.$)
    const categoryKeys = Object.keys(scraper.amenitiesConfig)
    categoryKeys.forEach((categoryKey) => {
      const category = scraper.amenitiesConfig[categoryKey]
      if (!scraper.amenities[categoryKey]) scraper.amenities[categoryKey] = {}
      category.forEach((amenityObj, i) => {
        const { text, value, variants } = amenityObj
        const alreadyFound = amenityAlreadyFound(value, scraper.amenities[categoryKey])
        if (!alreadyFound) {
          const variantsIsArray = Array.isArray(variants)
          const amenities = variantsIsArray ? [text, ...variants] : [text]
          const hasAmenity = keywordMatch(amenities, copy)
          // adds amenity to scraper.amenities.category
          if (hasAmenity) {
            scraper.amenities[categoryKey][value] = { text, value }
          }
        }
      })
    })
  }
}

function amenityAlreadyFound(amenity, category) {
  return !!(category[amenity])
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
  const string = keywords.map(word => {
    const isPlural = word.length > 2 && word.slice(-1) === 's'
    const pluralizedWord = isPlural ? word : `${word}s`
    return `(?:^|\\b)${pluralizedWord}?(?:$|\\b)`
  })
  .join('|')
  return new RegExp(string, 'gi')
}

//returns boolean
function keywordMatch(keywords, copy) {
  const pattern = buildRegexPattern(keywords)
  return pattern.test(copy)
}
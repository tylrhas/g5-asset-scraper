const parser = require('parse-address')
module.exports = {
  init,
  getSocialLinks,
  socialMap
}
function init (Scraper) {
  Scraper.addProp('socialLinks', {}, true)
  Scraper.addProp('socialMap', socialMap, false)
  Scraper.addScraper('afterPageChange', getSocialLinks)
}

const socialMap = () => {
  return {
    yelp: /(?:https?:)?\/\/(?:[A-z]+\.)?yelp.com\/biz\/(?P<username>[A-z0-9-]+)\/?/gm,
    facebook: /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/gm,
    twitter: /(?:https?:)?\/\/(?:[A-z]+\.)?twitter.com\/(?P<username>[A-z0-9-]+)\/?/gm,
    pinterest: /(?:https?:)?\/\/(?:[A-z]+\.)?pinterest.com\/(?P<username>[A-z0-9-]+)\/?/gm,
    instagram: /(?:https?:)?\/\/(?:[A-z]+\.)?instagram.com\/(?P<username>[A-z0-9-]+)\/?/gm,
    youtube: /(?:https?:)?\/\/(?:[A-z]+\.)?youtube.com\/user\/(?P<username>[A-z0-9-]+)\/?/gm,
    linkedin: /(?:https?:)?\/\/(?:[A-z]+\.)?linkedin.com\/in\/(?P<username>[A-z0-9-]+)\/?/gm
  }
}

function getSocialLinks(scraper) {
  const socialLinks = scraper.$(scraper.template.social.selector ? scraper.template.social.selector : 'body').html()
  for (const [key, value] of Object.entries(scraper.socialMap())) {
    const matched = socialLinks.match(value)
    if (matched) {
      scraper.socialLinks[key] = value
    }
  }
}
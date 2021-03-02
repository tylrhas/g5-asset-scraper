const socialMap = {
  yelp: /(?:https?:)?\/\/(?:[A-z]+\.)?yelp.com\/biz\/([A-z0-9-]+)\/?/gm,
  facebook: /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/gm,
  twitter: /(?:https?:)?\/\/(?:[A-z]+\.)?twitter.com\/([A-z0-9-]+)\/?/gm,
  pinterest: /(?:https?:)?\/\/(?:[A-z]+\.)?pinterest.com\/([A-z0-9-]+)\/?/gm,
  instagram: /(?:https?:)?\/\/(?:[A-z]+\.)?instagram.com\/([A-z0-9-]+)\/?/gm,
  youtube: /(?:https?:)?\/\/(?:[A-z]+\.)?youtube.com\/user\/([A-z0-9-]+)\/?/gm,
  linkedin: /(?:https?:)?\/\/(?:[A-z]+\.)?linkedin.com\/(in|company)\/([A-z0-9-]+)\/?/gm,
  tumblr: /(?:https?:)?\/\/(?:[A-z]+\.)?tumblr.com\/?/gm
}

export function init (Scraper) {
  Scraper.addProp('socialLinks', {}, true)
  Scraper.addProp('socialMap', socialMap, false)
  Scraper.addScraper('afterPageChange', getSocialLinks)
}

export function getSocialLinks (scraper) {
  if (scraper.template.social.selector) {
    const html = scraper.$(scraper.template.social.selector).html()
    compareLinks(html, scraper)
  } else {
    const socialLinks = scraper.$('a').toArray()
    socialLinks.forEach((anchor) => { 
      if (anchor.attribs && anchor.attribs.href) {
        compareLinks(anchor.attribs.href, scraper)
      }
    })
  }
}

export function compareLinks (link, scraper) {
  for (const [key, value] of Object.entries(scraper.socialMap)) {
    if (!scraper.socialLinks[key]) {
      const matched = link.match(value)
      if (matched) {
        scraper.socialLinks[key] = matched[0]
      }
    }
  }
}

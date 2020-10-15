module.exports = (Scraper) => {
  Scraper.addProp('imageUrls', {})
  Scraper.addScraper('afterPageChange', scrapePhotos)
}

function scrapePhotos(scraper) {
  const urls = scraper.page.match(/([^="'])+\.(jpg|gif|png|jpeg)/gm)
  scraper.imageUrls[scraper.url] = [...new Set(urls.map(url => formatImageUrl(url, scraper.rootProtocol, scraper.rootdomain)))]
}

function formatImageUrl(url, rootProtocol, rootdomain) {
  if (url.includes('(')) {
    url = url.split('(')[1]
  }
  const protocol = /^(http|https)/.test(url)
  if (protocol) {
    return url
  }
  const noProtocol = url.replace(/^\/\//, '')
  const cleanPath = noProtocol.replace(/^\//, '')
  const isDomain = /\.(com|net|org|biz|ca|info)/.test(cleanPath)
  if (isDomain) {
    return `${this.rootProtocol}://${cleanPath}`
  }
  return `${this.rootdomain}/${cleanPath}`
}
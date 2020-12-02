const cloudinary = require("../cloudinary")

module.exports = {
  init,
  uploadPhotos,
  scrapePhotos,
  formatImageUrl
}  
function init (Scraper) {
  Scraper.addProp('imageUrls', {}, true)
  Scraper.addScraper('afterPageChange', scrapePhotos)
  Scraper.addScraper('afterScrape', uploadPhotos)
}
async function uploadPhotos(scraper) {
  const imageUrls = Object.keys(scraper.imageUrls)
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageUrl = imageUrls[i]
      const tags = scraper.imageUrls[imageUrl]
      const url = await cloudinary.upload(imageUrl, { folder: scraper.config.photos.folder, tags})
      console.log('uploaded')
    } catch (error) {
      console.log(error)
    }
  }
}
function scrapePhotos(scraper) {
  const urls = [...new Set(scraper.page.match(/([^="'])+\.(jpg|gif|png|jpeg)/gm)
    .map(url => formatImageUrl(url, scraper.rootProtocol, scraper.rootdomain)))]
  const pageUrl = scraper.url
  urls.forEach((url) => {
    if (!scraper.imageUrls[url]) {
      scraper.imageUrls[url] = []
    }
    scraper.imageUrls[url].push(pageUrl)
  })
}

function formatImageUrl(url, rootProtocol, rootdomain) {
  if (url.includes('(')) {
    url = url.split('(')[1]
  }
  if (url.includes(')')) {
    url = url.split(')')[0]
  }
  const protocol = /^(http|https)/.test(url)
  if (protocol) {
    return url
  }
  const noProtocol = url.replace(/^\/\//, '')
  const cleanPath = noProtocol.replace(/^\//, '')
  const isDomain = /\.(com|net|org|biz|ca|info)/.test(cleanPath)
  if (isDomain) {
    return `${rootProtocol}://${cleanPath}`
  }
  return `${rootProtocol}://${rootdomain}/${cleanPath}`
}

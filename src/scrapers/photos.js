import { upload } from "../cloudinary"

export function init (Scraper) {
  Scraper.addProp('imageUrls', {}, true)
  Scraper.addScraper('afterPageChange', scrapePhotos)
  Scraper.addScraper('afterScrape', uploadPhotos)
}

export async function uploadPhotos (scraper) {
  const imageUrls = Object.keys(scraper.imageUrls)
  const uploads = []
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageUrl = imageUrls[i]
      const tags = scraper.imageUrls[imageUrl]
      const attribs = {
        folder: scraper.config.photos.folder,
        // auto_tagging: 0.8,
        context: `sources=${tags.join(',')}`
      }
      uploads.push(upload(imageUrl, attribs))
    } catch (error) {
      console.log(error)
    }
  }

  return Promise.all(uploads)
    .catch((err) => {
      console.log('A promise failed to resolve', err)
      return uploads
  })
}

export function scrapePhotos (scraper) {
  const { page, url: pageUrl, rootProtocol, rootDomain } = scraper 
  const pattern = /([^="'])+\.(jpg|gif|png|jpeg|pdf)/gm
  const urls = [
    ...new Set(page.match(pattern).map(url => formatImageUrl(url, rootProtocol, rootDomain)))
  ]

  urls.forEach((url) => {
    if (!scraper.imageUrls[url]) {
      scraper.imageUrls[url] = []
    }
    scraper.imageUrls[url].push(pageUrl)
  })
}

export function formatImageUrl (url, rootProtocol, rootDomain) {
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
  return `${rootProtocol}://${rootDomain}/${cleanPath}`
}

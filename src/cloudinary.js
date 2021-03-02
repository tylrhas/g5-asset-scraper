const cloudinary = require('cloudinary').v2

const {
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET
} = process.env

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: parseInt(CLOUDINARY_KEY),
  api_secret: CLOUDINARY_SECRET
})

module.exports = {
  /**
   * Cloudinary bulk upload
   * @param {String} urls array of Strings of urls
   * @param {Object} attribs { folder: Sring, tags: Array of Strings }
   */
  upload: async function (url, attribs) {
    if (!url) return;
    return new Promise((res, rej) => {
      cloudinary.uploader.upload(url, attribs, function (err, response) {
        if (!err) {
          res(response)
        } else {
          rej(err)
        }
      })
    })
  }
}
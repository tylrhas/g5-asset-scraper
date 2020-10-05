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
  upload
}

function upload (url, location, page) {
  console.log(`Uploading from ${url}`)
  return new Promise((res, rej) => {
    cloudinary.uploader.upload(url, { folder: `${location}/${page}` }, function (err, response) {
      if (!err) {
        res(response)
      } else {
        rej(err)
      }
    })
  })
}

function getImage (id) {}

function update (id, attr) {
  console.log(`Updating ${id}`);
  return new Promise((res, rej) => {})
}

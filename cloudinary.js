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

async function upload(urls, attribs) {
  if (!urls || urls.length <= 0) return;
  try {
    return await Promise.all(urls.map((url) => {
      return new Promise((res, rej) => {
        cloudinary.uploader.upload(url, attribs, function (err, response) {
          if (!err) {
            res(response)
          } else {
            rej(err)
          }
        })
      })
    }))
  } catch (err) {
    console.error(err)
    return err
  }
}

function getImage(id) {}

function update(id, attr) {
  console.log(`Updating ${id}`)
  return new Promise((res, rej) => {})
}

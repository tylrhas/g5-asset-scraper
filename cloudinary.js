const cloudinary = require('cloudinary').v2
const {
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET
} = process.env

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET
})

module.exports = {
  upload
}

async function upload (url) {
  console.log(url)
  const res = await cloudinary.uploader.upload(url, (err, res) => {
    if (err) {
      console.error(err)
      return err
    }
    return res
  })
  return res
}

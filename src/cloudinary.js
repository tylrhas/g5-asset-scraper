import { v2 as cloudinary } from 'cloudinary'

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

export async function upload (url, attribs) {
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

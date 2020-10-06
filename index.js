const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json({ limit: '1000kb' }))
const Scraper = require('./scraper')
const { upload } = require('./cloudinary')

app.post('/', async (req, res) => {
  const { body } = req
  const scraper = new Scraper(body)
  await scraper.run()
  res.send('Hello')
})

app.post('/upload', async (req, res) => {
  const { urls, attribs } = req.body
  try {
    const cloudinaryRes = await upload(urls, attribs)
    res.json(cloudinaryRes)
  } catch (err) {
    res.status(500).json(err)
  }
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

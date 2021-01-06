require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json({ limit: '1000kb' }))
const Scraper = require('./scraper')
const { upload } = require('./cloudinary')

app.post('/', async (req, res) => {
  const {body} = req
  try {
    const scraper = new Scraper(body)
    await scraper.run()
    const results = scraper.results()
    res.json(results)
  } catch (error) {
    console.log(error)
    res.status(422).send(error.message)
  }
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

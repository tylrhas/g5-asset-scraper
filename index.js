const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json({ limit: '1000kb' }))
const Scraper = require('./scraper')
app.post('/', async (req, res) => {
  const { body } = req
  const scraper = new Scraper(body)
  await scraper.run()
  res.send('Hello')
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
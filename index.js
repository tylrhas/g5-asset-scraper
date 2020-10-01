const express = require('express')
const app = express();
const Scraper = require('./scraper')
app.get('/', (req, res) => {
  const { body } = req
  const scraper = new Scraper(body)
  await scraper.run()
  res.send('Hello')
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
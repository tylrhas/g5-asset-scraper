const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json({ limit: '1000kb' }))
const Scraper = require('./scraper')
const { upload } = require('./cloudinary')

app.post('/', async (req, res) => {
  try {
    const { body } = req
    if (body.topicName) {
      const scraper = new Scraper(body)
      scraper.run()
      // const results = scraper.results()
      res.sendStatus(200) 
    } else {
      const scraper = new Scraper(body)
      await scraper.run()
      const results = scraper.results()
      res.json(results) 
    }

  } catch (error) {
    res.status(422).send(error.message)
  }
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

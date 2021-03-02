require('dotenv').config()
const express = require('express')
// const bodyParser = require('body-parser')
const app = express({ limit: '1000kb' })
// app.use(bodyParser.json())
const Scraper = require('./scraper')

app.post('/', async (req, res) => {
  try {
    const { body } = req
    console.log(req)
    if (body.topicName) {
      const scraper = new Scraper(body)
      scraper.run()
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

app.listen(port, () => console.log(`:${port} I'm Listening.`))

require('dotenv').config()

const express = require('express')
const { json } = require('body-parser')
const app = express()
const Scraper = require('./scraper')
const port = process.env.PORT || 8080

app.use(json({ limit: '1000kb' }))

app.get('/', (req, res) => res.status(200).send('I\'m Listening.'))

app.post('/', async (req, res) => {
  try {
    const scraper = new Scraper(req.body)
    await scraper.run()
    const results = scraper.results()
    res.json(results)
  } catch (error) {
    res.status(422).send(error.message)
  }
})

app.listen(port, () => console.log(`:${port} I'm Listening.`))

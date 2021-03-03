import '@babel/polyfill'
require('dotenv').config()

import express from 'express'
import { json } from 'body-parser'
import Scraper from './scraper'

const app = express()

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

const port = process.env.PORT || 8080

app.listen(port, () => console.log(`:${port} I'm Listening.`))

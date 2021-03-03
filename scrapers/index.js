const fs = require('fs')
const path = require('path')
const audits = {}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'README.md')
  .forEach(file => {
    const auditName = file.replace('.js','')
    const audit = require(path.join(__dirname, file))
    if (!audit.init) throw new Error('Each Scraper needs to have an init function exported')
    audits[auditName] = audit.init
  })

module.exports = Object.assign(audits)

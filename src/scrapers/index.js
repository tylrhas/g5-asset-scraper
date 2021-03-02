const fs = require('fs')
const path = require('path')
const audits = {}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'README.md')
  .forEach((file) => {
    const auditName = file.replace('.js','')
    const audit = require(path.join(__dirname, file))
    if (!audit.init) {
      throw new Error('Each scraper module needs to export an init function.')
    }
    audits[auditName] = audit.init
  })

export default Object.assign(audits)

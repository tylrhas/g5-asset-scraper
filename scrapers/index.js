const fs = require('fs')
const path = require('path')
const audits = {}
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'README.md')
  .forEach(file => {
    const auditName = file.replace('.js','')
    const audit = require(path.join(__dirname, file))
    audits[auditName] = audit
  })

  module.exports = Object.assign(audits)

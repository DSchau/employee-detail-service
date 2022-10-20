module.exports = {
  ['text/csv']: require('./write-csv'),
  ['application/json']: require('./write-json')
}

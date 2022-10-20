const express = require('express')

const getEmployeeList = require('./lib/get-employees')
const enrichEmployees = require('./lib/write-employees')
const write = require('./lib/write')

const PORT = process.env.PORT || 3000
const BEARER_TOKEN = process.env.BEARER_TOKEN

const app = express()

app.get('/:companyName', async (req, res) => {
 const { companyName } = req.params
 const authorization = req.headers.authorization
 const contentType = req.headers['content-type']

 try {
  console.log(authorization, BEARER_TOKEN)
  const matches = authorization ? authorization.split(' ').pop().trim() === BEARER_TOKEN : false

  if (!matches) {
   return res.status(403).json({
     message: 'Please pass an authorization header with a bearer token'
   })
  }

  const { employees } = await getEmployeeList(companyName)
  const detailed_employees = await enrichEmployees(employees, companyName)

  let formatter = write[contentType]
  if (!formatter) {
    console.log('No appropriate content type found, falling back to JSON')
    formatter = write['application/json']
  }

  return formatter(detailed_employees)(req, res)

 } catch (e) {
  return res.status(500).json({
    error: e.message,
    stack: e.stack
  })
 }
})

app.listen(PORT, () => {
  console.log(`Employee App running on port: ${PORT}`)
})

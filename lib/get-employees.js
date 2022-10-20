const axios = require('axios')
const fs = require('fs/promises')

const getCache = require('./get-cache-file')

module.exports = async function getEmployees(companyName) {
  const [cached, fileName] = await getCache('employees', companyName)

  if (cached) {
    return cached
  }

  const data = [
    {
      employee_id: 1234,
      profile_url: '1234'
    }
  ]

  // const data = await axios.get(
  //   [
  //     'https://nubela.co/proxycurl/api/linkedin/company/employees?',
  //     `url=https://www.linkedin.com/company/${companyName}`
  //   ].join(''),
  //   {
  //     headers: {
  //       'Authorization': `Bearer ${process.env.API_KEY}`
  //     }
  //   }
  // )
  //   .then(res => res.data)

  fs.writeFile(fileName, JSON.stringify(data, null, 2), 'utf8')

  return data
}
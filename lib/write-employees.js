const chunk = require('lodash/chunk')
const fs = require('fs/promises')

const getCache = require('./get-cache-file')

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE || 10, 10)

module.exports = async function writeEmployees(cached_employees, companyName) {
  const [cache, fileName] = await getCache('employees_detail', companyName)

  if (cache) {
    return cache
  }

  let normalized = cached_employees.reduce((merged, employee) => {
    const key = employee.profile_url.split('/').pop()
    merged[key] = {
      profile_url: employee.profile_url
    }
    return merged
  }, {})

  const keys = chunk(Object.keys(normalized), CHUNK_SIZE)
  let count = 0

  for (const chunk of keys) {
    await Promise.all(
      chunk.map(async key => {
        const employee = normalized[key]

        const data = await axios.get(
          [
            'https://nubela.co/proxycurl/api/v2/linkedin?',
            `url=${employee.profile_url}`,
            `&personal_email=`
          ].join(''),
          {
            headers: {
              'Authorization': `Bearer ${process.env.API_KEY}`
            }
          }
        )
          .then(res => res.data)
    
        count += 1
    
        console.log(`fetched ${count} of ${keys.length}`)
    
        normalized[key] = Object.assign({}, employee, data)
      })
    )

    fs.writeFile(fileName, JSON.stringify(normalized, null, 2), 'utf8')
  }

  return normalized
}
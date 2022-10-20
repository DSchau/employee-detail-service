const fs = require('fs/promises')
const constants = require('fs').constants

const FILE_LOOKUP = {
  employees: (key) => `employee-${key}.json`,
  employees_detail: (key) => `employee-detail-${key}.json`
}

module.exports = async (type, key) => {
  const lookup = FILE_LOOKUP[type]

  if (!lookup) {
    throw new Error(`Lookup ${type} not found`)
  }

  const file = lookup(key)

  try {
    await fs.access(file, constants.R_OK)
    return [
      await fs.readFile(file, 'utf8')
        .then(res => JSON.parse(res)),
      file
    ]
  } catch (e) {
    console.log(e, e.message)
    return [false, file]
  }
}

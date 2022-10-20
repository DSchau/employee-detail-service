module.exports = function writeCSV(employees) {
  return (req, res) => {
    const csv = getCSV(employees)

    res.attachment('employees.csv')

    return res.status(200).send(csv)
  }
}

function getCSV(employees) {
  const employee_keys = Object.keys(employees)

  const header = [
    'Full Name',
    'First Name',
    'Last Name',
    'Occupation',
    'LinkedIn',
    'Country',
    'City',
    'State',
    'Summary'
  ].join(',')

  let rows = []

  for (const key of employee_keys) {
    const employee = employees[key]
    rows.push(
      [
        employee.full_name,
        employee.first_name,
        employee.last_name,
        employee.occupation,
        employee.profile_url,
        employee.country_full_name,
        employee.city,
        employee.state,
        (employee.summary || '').replace(/\n/g, ' ').replace(/\|/g, ' ').replace(/\s{2,}/g, ' ')
      ]
        .map(part => (part || '').replace(/,/g, ' ').trim())
        .join(',')
    )
  }

  const joined = [header].concat(rows).join('\n')

  return joined
}

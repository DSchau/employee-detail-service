module.exports = function (data) {
  return (req, res) => {
    return res.status(200).json(data)
  }
}

var through = require('through2')

  , compressResponse = function (req, res) {
      return through()
    }

module.exports = compressResponse
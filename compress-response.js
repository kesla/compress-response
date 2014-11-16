var zlib = require('zlib')

  , bestEncoding = require('best-encoding')
  , through = require('through2')

  , compressResponse = function (req, res) {
      var stream

      if (bestEncoding(req) === 'gzip') {
        res.setHeader('content-encoding', 'gzip')
        stream = zlib.createGzip()
      } else {
        stream = through()
      }

      stream.pipe(res)

      return stream
    }

module.exports = compressResponse
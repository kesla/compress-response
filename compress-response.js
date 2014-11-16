var zlib = require('zlib')

  , bestEncoding = require('best-encoding')
  , compressible = require('compressible')
  , through = require('through2')

  , compressResponse = function (req, res) {
      var stream
        , type = res.getHeader('content-type')

      if (bestEncoding(req) === 'gzip' && compressible(type)) {
        res.setHeader('content-encoding', 'gzip')
        stream = zlib.createGzip()
      } else {
        stream = through()
      }

      stream.pipe(res)

      return stream
    }

module.exports = compressResponse
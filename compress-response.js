var zlib = require('zlib')

  , bestEncoding = require('best-encoding')
  , compressible = require('compressible')
  , through = require('through2')

  , handleFirst = function (req, res, stream) {
      var type = res.getHeader('content-type')
      if (bestEncoding(req) === 'gzip' && compressible(type)) {
        res.setHeader('content-encoding', 'gzip')
        stream.pipe(zlib.createGzip()).pipe(res)
      } else {
        stream.pipe(res)
      }
    }

  , compressResponse = function (req, res) {
      var first = true
        , stream = through(function (chunk, _, callback) {
            if (first) handleFirst(req, res, stream)
            first = false
            callback(null, chunk)
          })

      return stream
    }

module.exports = compressResponse
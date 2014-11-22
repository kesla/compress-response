var zlib = require('zlib')

  , bestEncoding = require('best-encoding')
  , compressible = require('compressible')
  , headStream = require('head-stream')
  , writeonly = require('write-only-stream')

  , decideEncoding = function (req, res, stream) {
      var type = res.getHeader('content-type')
      if (bestEncoding(req) === 'gzip' && compressible(type)) {
        res.setHeader('content-encoding', 'gzip')
        stream.pipe(zlib.createGzip()).pipe(res)
      } else {
        stream.pipe(res)
      }
    }

  , compressResponse = function (req, res) {
      var onHead = function (chunk, callback) {
            decideEncoding(req, res, stream)
            callback()
          }
        , stream = headStream(onHead, { includeHead: true })

      return writeonly(stream)
    }

module.exports = compressResponse
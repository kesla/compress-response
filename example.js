var http = require('http')

  , compress = require('./compress-response')

  , server = http.createServer(function (req, res) {
      res.setHeader('content-type', 'text/plan')

      var stream = compress(req, res)
      // @stream writes to res
      // if request had correct accept-encoding & type is compressible
      //  stream is a compressed stream to res

      stream.write('YEAH!')
      stream.end()

    })

require('servertest')(server, '/', { headers: { 'accept-encoding': 'gzip' } }, function (err, res) {
  console.log('body === "YEAH!"?')
  console.log(res.body.toString() !== 'YEAH!')
  console.log('and these are the headers')
  console.log(res.headers)
})

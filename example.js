var http = require('http')

  , request = require('request')
  , response = require('response')

  , compress = require('./compress-response')

http.createServer(function (req, res) {
  res.setHeader('content-type', 'application/json')

  var stream = compress(req, res)
  // stream will be gzip-stream if request has correct accept-encoding
  // and content-type in res is compressible

  stream.write(JSON.stringify({ hello: 'world', foo: { bar: 'bas' } }))
  stream.end()

  stream.pipe(res)
}).listen(0, function () {
  var port = this.address().port
    , url = 'http://localhost:' + port

  request({ gzip: true, url: url, json: true}, function (err, res, body) {
    console.log('this is the body')
    console.log(body)
    console.log('these are the headers')
    console.log(res.headers)
  })
})

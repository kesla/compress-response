var http = require('http')
  , servertest = require('servertest')
  , test = require('tape')

  , compress = require('./compress-response')

test('basic', function (t) {
  var server = http.createServer(function (req, res) {
        var stream = compress(req, res)
        stream.write('beep')
        stream.write('boop')
        stream.end()
      })

  servertest(server, '/', function (err, res) {
    t.equal(res.body.toString(), 'beepboop')
    t.end(err)
  })
})
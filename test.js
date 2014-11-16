var http = require('http')
  , zlib = require('zlib')

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

test('gziped enabled & no type', function (t) {
  var server = http.createServer(function (req, res) {
        var stream = compress(req, res)
        stream.write('Hello, world!')
        stream.end()
      })
    , options = { headers: {'accept-encoding': 'gzip'} }

  servertest(server, '/', options, function (err, res) {
    if (err) return t.end(err)

    t.notEqual(res.headers['content-encoding'], 'gzip')

    t.deepEqual(res.body.toString(), 'Hello, world!')
    t.end()
  })
})

test('gziped enabled & none-compressible type', function (t) {
  var server = http.createServer(function (req, res) {
        res.setHeader('content-type', 'image/jpeg')

        var stream = compress(req, res)
        stream.write('Hello, world!')
        stream.end()
      })
    , options = { headers: {'accept-encoding': 'gzip'} }

  servertest(server, '/', options, function (err, res) {
    if (err) return t.end(err)

    t.notEqual(res.headers['content-encoding'], 'gzip')

    t.deepEqual(res.body.toString(), 'Hello, world!')
    t.end()
  })
})

test('gziped enabled & compressible type', function (t) {
  var server = http.createServer(function (req, res) {
        res.setHeader('content-type', 'text/plain')

        var stream = compress(req, res)
        stream.write(JSON.stringify('Hello, world!'))
        stream.end()
      })
    , options = { headers: {'accept-encoding': 'gzip'} }

  servertest(server, '/', options, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.headers['content-encoding'], 'gzip')
    zlib.gunzip(res.body, function (err, result) {
      if (err) return t.end(err)

      t.deepEqual(JSON.parse(result.toString()), 'Hello, world!')
      t.end()
    })
  })
})

test('gziped enabled & compressible type, create stream first', function (t) {
  var server = http.createServer(function (req, res) {
        var stream = compress(req, res)

        res.setHeader('content-type', 'text/plain')

        stream.write(JSON.stringify('Hello, world!'))
        stream.end()
      })
    , options = { headers: {'accept-encoding': 'gzip'} }

  servertest(server, '/', options, function (err, res) {
    if (err) return t.end(err)

    t.equal(res.headers['content-encoding'], 'gzip')
    zlib.gunzip(res.body, function (err, result) {
      if (err) return t.end(err)

      t.deepEqual(JSON.parse(result.toString()), 'Hello, world!')
      t.end()
    })
  })
})

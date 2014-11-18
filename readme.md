# compress-response[![build status](https://secure.travis-ci.org/kesla/compress-response.png)](http://travis-ci.org/kesla/compress-response)

streaming http response compression thingy

[![NPM](https://nodei.co/npm/compress-response.png?downloads&stars)](https://nodei.co/npm/compress-response/)

[![NPM](https://nodei.co/npm-dl/compress-response.png)](https://nodei.co/npm/compress-response/)

## Installation

```
npm install compress-response
```

## Example

### Input

```javascript
var http = require('http')

  , compress = require('compress-response')

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
  console.log(res.body.toString() === 'YEAH!')
  console.log('and these are the headers')
  console.log(res.headers)
})
```

### Output

```
body === "YEAH!"?
false
and these are the headers
{ 'content-type': 'text/plan',
  'content-encoding': 'gzip',
  date: 'Sun, 16 Nov 2014 01:54:42 GMT',
  connection: 'close',
  'transfer-encoding': 'chunked' }
```

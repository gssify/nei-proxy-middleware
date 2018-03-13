const request = require('request')
const getRawBody = require('raw-body')
const contentType = require('content-type')
const qs = require('querystring')

function neiProxyMiddleware (options) {
  const baseUrl = 'https://nei.netease.com:443/api/mockdata?'
  const neiHeaders = { 'Content-Type': 'text/plain;charset=utf-8' }
  const { key, mockname = 'neimock', rule = '/api' } = options

  if (!key) throw new Error('Need NEI key')

  function middleware (req, res, next) {
    shouldProxy(req).then(() => {
      const { path, method } = req
      const query = qs.stringify({
        key,
        path,
        method,
        type: 3
      })

      request(baseUrl + query, (error, response, result) => {
        if (error) return next(error)
        res.set(neiHeaders)
        res.end(result)
      })
    }).catch(() => {
      next()
    })
  }

  function shouldProxy (req) {
    return new Promise((resolve, reject) => {
      if (!req.path.startsWith(rule)) return reject(new Error(`not start with ${rule}`))
      if (req.query[mockname] !== undefined) return resolve()
      getRawBody(req, {
        encoding: contentType.parse(req).parameters.charset
      }, (error, body) => {
        error ? reject(new Error(error)) : ~body.indexOf(mockname) ? resolve() : reject(new Error(`not found ${mockname}`))
      })
    })
  }

  return middleware
}

module.exports = neiProxyMiddleware

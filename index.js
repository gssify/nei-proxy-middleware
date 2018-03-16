const request = require('request')
const qs = require('querystring')

const baseUrl = 'https://nei.netease.com:443/api/mockdata?'
const neiHeaders = { 'Content-Type': 'text/plain;charset=utf-8' }

function neiProxyMiddleware (options) {
  const { key, mockname = 'neimock', rule = '/api' } = options

  if (!key) throw new Error('Need NEI key')

  function middleware (req, res, next) {
    if (shouldProxy(req)) {
      const { path, method } = req
      const query = qs.stringify({ key, path, method, type: 3 })
      request(baseUrl + query, (error, response, data) => {
        if (error) return next()
        const { code, result: { json } } = JSON.parse(data)
        res.set(neiHeaders)
        res.json(json)
      })
    } else {
      next()
    }
  }

  function shouldProxy (req) {
    return req.path.startsWith(rule) && req.query[mockname] !== undefined
  }

  return middleware
}

module.exports = neiProxyMiddleware

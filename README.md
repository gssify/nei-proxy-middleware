# NEI Proxy Middleware

NEI(https://nei.netease.com/) 平台接口转换工具，可以像使用 easy-mock 一样使用

## 使用

### 安装
```js
npm install --save-dev nei-proxy-middleware
```

### 开发服务器配置
```js
const express = require('express')
const neiProxyMiddleware = require('nei-proxy-middleware')
const app = express()
app.use(neiProxyMiddleware({ key: 'NEI_KEY', mockname: 'neimock', rule: '/api' }))

app.listen(3000)
```


### 业务代码修改
```js
request('http://foo.com/api/bar?neimock=true', function (data) {
  // data: remote from nei
})
```

## 问题

不支持 Koa

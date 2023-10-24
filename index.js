const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream('./index.html').pipe(res)
  } else if (req.url === '/book') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream('./form.html').pipe(res)
  } else if (req.url === '/notice') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream('./notice.html').pipe(res)
  } else if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream('./notice.html').pipe(res)
  } else {
    res.writeHead(404)
    res.end('Page not found')
  }
})

server.listen(5000, () => {
  console.log('Server listening on port 5000')
})

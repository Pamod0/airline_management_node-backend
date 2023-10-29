require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('Welcome')
})

// we can use 'Postman' for send a get request with body
app.post('/login', (req, res) => {
  const username = req.body.username
  const user = { name: username }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  const response = {
    user,
    accessToken
  }
  res.json(response)
})

// plug generated token in the header using postman
// then we can access to the protected CRUD routes
app.get('/create', authenticateToken, (req, res) => {
  res.status(200).send('Create')
})

app.get('/read', authenticateToken, (req, res) => {
  res.status(200).send('Read')
})

app.get('/update', authenticateToken, (req, res) => {
  res.status(200).send('update')
})

app.get('/delete', authenticateToken, (req, res) => {
  res.status(200).send('delete')
})

// function for verify the token
function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
};

app.listen(5000, () => {
  console.log('Server listening on port 5000')
})

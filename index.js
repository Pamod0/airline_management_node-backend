require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.get('/user/my-details', authenticateToken, (req, res) => {
  res.json(users.filter(user => user.name === req.user.name))
})

app.post('/users/signup', async (req, res) => {
  const name = req.body.name
  const password = req.body.password

  const userJwt = { name }
  const accessToken = jwt.sign(userJwt, process.env.ACCESS_TOKEN_SECRET)

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = { name, password: hashedPassword, accessToken }
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.get('/user/create', authenticateToken, (req, res) => {
  res.status(200).send('Create')
})

app.get('/user/read', authenticateToken, (req, res) => {
  res.status(200).send('Read')
})

app.get('/user/update', authenticateToken, (req, res) => {
  res.status(200).send('update')
})

app.get('/user/delete', authenticateToken, (req, res) => {
  res.status(200).send('delete')
})

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

app.listen(5000, () => console.log('Server started on port 5000'))

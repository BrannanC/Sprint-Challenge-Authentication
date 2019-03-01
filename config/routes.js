const axios = require('axios');
const db = require('../database/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
  server.get('/api/users', getUsers);
};

function register(req, res) {
  let user = req.body;
  if(!user.username || !user.password){
    res.status(400).json({ err: 'Please provide username and password' })
  } else {
    const hash = bcrypt.hashSync(user.password, 12)
    user.password = hash;
    return db('users').insert(user)
      .then(id => res.status(201).json({ id: id[0] }))
      .catch(err => {
        res.status(500).json({ err: 'Could not register user' })
      });
  }

}

const jwtKey =
  process.env.JWT_SECRET ||
  'add a .env file to root of project with the JWT_SECRET variable';

function generateToken(user){
  const payload = {
      subject: user.id,
      username: user.username,
  }

  const options = {
      expiresIn: '1d'
  }

  return jwt.sign(payload, jwtKey, options);
}

function login(req, res) {
  let { username, password } = req.body;
  if(!username || !password){
    res.status(400).json({message: 'Username and password required' })
  } else {
    return db('users')
        .where({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
              const token = generateToken(user);
              res
                .status(200)
                .json({ user: {username: user.username, id: user.id}, token  });
            } else {
              res.status(401).json({ message: 'Invalid Credentials' });
            }
          })
          .catch(error => {
            res.status(500).json({error, username});
          });
  }
}

function getUsers(req, res) {
  return db('users').select('id', 'username', 'password')
          .then(users => res.status(200).json({ users }));
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get(`https://icanhazdadjoke.com/search?page=${req.headers.page}`, requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

require('dotenv').config();

const express = require('express')
const consola = require('consola')
const app = express()

const bodyParser = require('body-parser');
const config = require('./config')


const router = express.Router();
const routes = require('./routes/index.js');

config.dev = process.env.NODE_ENV !== 'production'

async function start () {

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // Init Nuxt.js

  const { host, port } = config.development;

  
  app.use('/api', routes(router));

  
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

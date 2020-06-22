require('dotenv').config();

const express = require('express')
const consola = require('consola')
const app = express()

const bodyParser = require('body-parser');
const config = require('./config')


const router = express.Router();
const routes = require('./routes/index.js');


  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // Init Nuxt.js

  const port = process.env.PORT || 5000;

  
  app.use('/api', routes(router));

  app.get('/', (req, res) => {
    res.send('Hello Guys')
  })
  
  // Listen the server
  // app.listen(port, host)
  // consola.ready({
  //   message: `Server listening on http://${host}:${port}`,
  //   badge: true
  // })

  app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
  });


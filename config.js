module.exports = {
    development: {
      host: process.env.host || 'localhost',
      port: process.env.PORT || 3000,
      saltingRounds: 10
    }
  }
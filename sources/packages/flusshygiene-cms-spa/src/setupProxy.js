const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api/v1', { target: 'http://localhost:5004' }));
  app.use(proxy('/ocpu', { target: 'http://localhost:8004' }));
};

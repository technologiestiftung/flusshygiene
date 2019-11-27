const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy(
      ['/middlelayer/predict', '/middlelayer/model', '/middlelayer/calibrate'],
      {
        target: 'http://localhost:8888/middlelayer',
        changeOrigin: true,
      },
    ),
  );
  app.use(
    proxy('/api', {
      target: 'http://localhost:8888/api',
      changeOrigin: true,
    }),
  );
  // app.use(proxy('/ocpu', { target: 'http://localhost:8004' }));
};

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  // app.use(
  //   proxy(
  //     ['/middlelayer/predict', '/middlelayer/model', '/middlelayer/calibrate'],
  //     {
  //       target: 'http://localhost:8888/middlelayer',
  //       changeOrigin: true,
  //     },
  //   ),
  // );
  app.use(
    createProxyMiddleware("/helpdesk/v1/messages", {
      target: "http://localhost:6004",
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware("/middlelayer/stream", {
      target: "http://localhost:4004",
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware("/api/*", {
      target: "http://localhost:5004",
      changeOrigin: true,
    }),
  );
  // app.use(proxy('/ocpu', { target: 'http://localhost:8004' }));
};

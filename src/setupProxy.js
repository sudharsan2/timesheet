const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/techstep/api',
    createProxyMiddleware({
      target: 'https://techstephub.focusrtech.com:5050',
      changeOrigin: true
    })
  );
};

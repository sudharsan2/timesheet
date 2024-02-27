const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/techstep/api',
    createProxyMiddleware({
      target: 'https://techstephub.focusrtech.com:3030',
      changeOrigin: true
    })
  );
};

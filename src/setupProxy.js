const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/auth/*', { target: 'https://gitforker.herokuapp.com' }));

  app.use(proxy('/*', { target: 'https://gitforker.herokuapp.com' }));
  app.use(proxy('/dashboard/*', { target: 'https://gitforker.herokuapp.com' }));

};
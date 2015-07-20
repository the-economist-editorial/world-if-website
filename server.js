/* eslint no-var: 0, object-shorthand: 0, strict: 0 */
'use strict';
require('babel/register');
var config = require('npcp');
var path = require('path');
var url = require('url');
var React = require('react');
var App = require('@economist/component-world-if-app');
var packagejson = require('./package');
var contentjson = require('./content');
var log = require('bunyan-request-logger')({
  name: packagejson.name,
});
log.info(config, 'booting with config');
var stats = packagejson.stats;
stats.name = packagejson.name;
stats.version = packagejson.version;
stats = JSON.stringify(stats);
// connect and middleware
module.exports = require('connect')()
  .use(require('serve-favicon')(
    path.join(__dirname, 'assets', 'favicon.ico')
  ))
  .use(require('compression')({
    level: 9,
  }))
  .use(log.requestLogger())
  .use('/application.manifest', require('connect-cache-manifest')({
    manifestPath: '/',
    files: [
      {
        dir: path.resolve(config.server.root, config.server.assets.dir),
        prefix: '/' + config.server.assets.uri + '/',
      },
    ],
    networks: [ '*' ],
  }))
  .use('/_stats', function sendStats(request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.end(stats);
  })
  .use('/content', require('@economist/connect-filter-jsonapi')({
    content: contentjson.data[0].relationships.posts.data,
  }))
  .use('/' + config.server.assets.uri, require('st')({
    path: path.resolve(config.server.root, config.server.assets.dir),
    gzip: false,
  }))
  .use(function handleReactRouterComponent(req, res, next) {
    try {
      res.end(
        '<!doctype html>' +
        React.renderToString(
          React.createElement(App, {
            path: url.parse(req.url).pathname,
            styles: require('./css-assets'),
            inlineStyles: require('./css-inline'),
            scripts: require('./js-assets'),
            inlineScripts: require('./js-inline'),
          })
        )
      );
    } catch(err) {
      return next(err);
    }
  })
  .use(log.errorLogger());
if (require.main === module) {
  module.exports.listen(config.server.port, function serve() {
    var address = this.address();
    address.url = 'http://localhost:' + address.port;
    log.info({ address: address }, 'Server running');
  });
}

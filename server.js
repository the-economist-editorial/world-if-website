/* eslint no-var: 0, object-shorthand: 0, strict: 0 */
'use strict';
require('babel/register');
var ONE_YEAR = 3.15569e10;
var config = require('npcp');
var path = require('path');
var url = require('url');
var React = require('react');
var packagejson = require('./package');
var log = require('bunyan-request-logger')({
  name: packagejson.name,
});
log.info(config, 'booting with config');
var stats = packagejson.stats;
stats.name = packagejson.name;
stats.version = packagejson.version;
stats = JSON.stringify(stats);

var HTML = require('@economist/component-world-if-html');
HTML.store.setContent(require('@economist/world-if-assets'));

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
        ignore: function ignoreImages(file) {
          return !/\.(js|css|otf)$/.test(file);
        },
      },
    ],
    networks: [ '*' ],
  }))
  .use('/_stats', function sendStats(request, response) {
    response.setHeader('Content-Type', 'application/json;charset=utf-8');
    response.end(stats);
  })
  .use('/' + config.server.assets.uri, require('st')({
    path: path.resolve(config.server.root, config.server.assets.dir),
    cache: {
      fd: {
        maxAge: ONE_YEAR,
      },
      stats: {
        maxAge: ONE_YEAR,
      },
      content: {
        maxAge: ONE_YEAR,
      },
      readdir: {
        maxAge: ONE_YEAR,
      },
    },
    gzip: false,
    passthrough: true,
    dot: false,
    index: false,
  }))
  .use('/article', function redirectArticleRoutesToSlugifiedVersions(request, response, next) {
    var pathParts = url.parse(request.url).pathname.match(/([^\/]+)/g);
    if (pathParts) {
      var id = pathParts[0];
      var slug = pathParts[1];
      var articleSlug = ((HTML.store.get(id) || {}).attributes || {}).slug;
      if (articleSlug && slug !== articleSlug) {
        response.writeHead(301, {
          'Location': '/article/' + id + '/' + articleSlug,
        });
        return response.end();
      }
    }
    next();
  })
  .use(function handleReactRouterComponent(request, response, next) {
    try {
      response.setHeader('Content-Type', 'text/html;charset=utf-8');
      response.end(
        '<!doctype html>' +
        React.renderToStaticMarkup(
          React.createElement(HTML, {
            path: url.parse(request.url).pathname,
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

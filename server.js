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
  .use('/_stats', function sendStats(request, response) {
    response.setHeader('Content-Type', 'application/json;charset=utf-8');
    response.end(stats);
  });

if (packagejson.protected && packagejson.protected.users && packagejson.protected.users.length) {
  var auth = require('basic-auth');
  module.exports.use(function basicAuth(request, response, next) {
    var credentials = auth(request);
    if (credentials && credentials.name && credentials.pass) {
      var validUsers = packagejson.protected.users.filter(function findValidUser(user) {
        return user.name === credentials.name &&
          user.pass === credentials.pass;
      });
      if (validUsers.length === 1) {
        return next();
      }
    }
    response.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="worldif"',
    });
    return response.end('Access Denied');
  });
}

module.exports
  .use(require('serve-favicon')(
    path.join(__dirname, 'assets', 'favicon.ico')
  ))
  .use(require('compression')({
    level: 9,
  }))
  .use(log.requestLogger())
  .use('/application.manifest', function setCacheHeadersForManifest(request, response, next) {
    response.setHeader('Cache-Control', 'public, max-age=60');
    next();
  })
  .use('/application.manifest', require('connect-cache-manifest')({
    manifestPath: '/',
    files: [
      {
        dir: path.resolve(config.server.root, config.server.assets.dir),
        prefix: '/' + config.server.assets.uri + '/',
        ignore: function ignoreImages(file) {
          return !/\.(js|css|otf|svg)$/.test(file);
        },
      },
    ],
    networks: [ '*' ],
  }))
  .use('/' + config.server.assets.uri, require('accept-webp')(
    path.resolve(config.server.root, config.server.assets.dir)
  ))
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
      var id = decodeURIComponent(pathParts[0]);
      var slug = decodeURIComponent(pathParts[1]);
      var articleSlug = ((HTML.store.get(id) || {}).attributes || {}).slug;
      if (articleSlug && slug !== articleSlug) {
        response.writeHead(301, {
          'Location': '/article/' + id + '/' + encodeURIComponent(articleSlug),
        });
        return response.end();
      }
    }
    next();
  })
  .use(require('etagify')())
  .use(function handleReactRouterComponent(request, response, next) {
    try {
      response.setHeader('Content-Type', 'text/html;charset=utf-8');
      response.setHeader('Cache-Control', 'public, max-age=3600');
      response.end(
        '<!doctype html>' +
        React.renderToStaticMarkup(
          React.createElement(HTML, {
            path: url.parse(request.url).pathname,
            title: 'The World If: A compilation of scenarios',
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
  .use(process.env.NODE_ENV === 'production' ?
    function productionError(error, request, response, next) {
      error.requestId = request && request.requestId;
      log.error({ err: error });
      response.writeHead(302, {
        'Location': '/',
      });
      response.end('Unexpected error');
      next();
    } :
    log.errorLogger()
  );
if (require.main === module) {
  module.exports.listen(config.server.port, function serve() {
    var address = this.address();
    address.url = 'http://localhost:' + address.port;
    log.info({ address: address }, 'Server running');
  });
}

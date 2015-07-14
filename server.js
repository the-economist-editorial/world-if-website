/* eslint no-console: 0 */
'use strict';
require('babel/register');
var config = require('npcp');
var path = require('path');
var packagejson = require('./package');
var contentjson = require('./content');
var log = require('bunyan-request-logger')({
  name: packagejson.name,
});
var template = require('handlebars').compile(require('fs').readFileSync('layout.html', 'utf8'));
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
  .use('/_stats', function sendStats(request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.end(stats);
  })
  .use('/content', require('@economist/connect-filter-jsonapi')({
    content: contentjson.data[0].relationships.posts.data
  }))
  .use('/' + config.server.assets.uri, require('st')({
    path: path.resolve(config.server.root, config.server.assets.dir),
    gzip: false,
  }))
  .use(require('@economist/connect-react-router-middleware')({
    routes: require('./routes'),
    template: function processTemplate(html) {
      return template({
        content: contentjson.data[0],
        assets: {
          'css': {
            files: require('./css-assets'),
            inline: require('./css-inline'),
          },
          'js': {
            files: require('./js-assets'),
            inline: require('./js-inline'),
          },
        },
        html: html,
      });
    },
  }))
  .use(log.errorLogger());
if (require.main === module) {
  module.exports.listen(config.server.port, function serve() {
    var address = this.address();
    address.url = 'http://localhost:' + address.port;
    log.info({ address: address }, 'Server running');
  });
}

/* eslint no-console: 0 */
'use strict';
require('babel/register');
var config = require('npcp');
var path = require('path');
var log = require('bunyan-request-logger')({
  name: require('./package').name,
});
var template = require('handlebars').compile(require('fs').readFileSync('layout.html', 'utf8'));
// connect and middleware
module.exports = require('connect')()
  .use(require('serve-favicon')(
    path.join(__dirname, 'assets', 'favicon.ico')
  ))
  .use(require('compression')({
    level: 9,
  }))
  .use(log.requestLogger())
  .use('/' + config.server.assets.uri, require('st')({
    path: path.resolve(config.server.root, config.server.assets.dir),
    gzip: false,
  }))
  .use(require('@economist/connect-react-router-middleware')({
    routes: require('./routes'),
    template: function processTemplate(html) {
      return template({
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

import React from 'react';
import App from '@economist/component-world-if-app';
/* eslint-env browser */
React.render(React.createElement(App, {
  path: window.location.pathname,
  styles: require('./css-assets'),
  inlineStyles: require('./css-inline'),
  scripts: require('./js-assets'),
  inlineScripts: require('./js-inline'),
}), document);

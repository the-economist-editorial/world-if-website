import React from 'react';
import App from '@economist/component-world-if-app';
/* eslint-env browser */
React.render(React.createElement(App, {
  path: window.location.pathname,
}), document.body);

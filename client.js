import React from 'react';
import App from '@economist/component-world-if-app';
import ArticleStore from '@economist/component-articlestore';
import content from '@economist/world-if-assets';
(new ArticleStore()).setContent(content);
/* eslint-env browser */
React.render(React.createElement(App, {
  path: window.location.pathname,
}), document.body);

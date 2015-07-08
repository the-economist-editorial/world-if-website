import React from 'react';
import routes from './routes';
import Router from 'react-router';
/* eslint-env browser */
Router.run(routes, Router.HistoryLocation, (Handler) => {
  React.render(<Handler/>, document.getElementById('app'));
});

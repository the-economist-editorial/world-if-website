import { Route, Link, RouteHandler } from 'react-router';
import React from 'react';
import App from '@economist/component-world-if-app';
import Article from '@economist/component-articletemplate';
import Home from '@economist/component-storytiles';

class RouteWrapper extends React.Component {
  render() {
    return (<App><RouteHandler/></App>);
  }
}

class NotFound extends React.Component {
  render() {
    return (
      <article>
        <h1>Oops 404</h1>
        <Link to="home">Back home</Link>
      </article>
    );
  }
}

export default (
  <Route path="/" handler={RouteWrapper}>
    <Route name="home" path="/" handler={Home}/>
    <Route name="article" path="article/:id" handler={Article}/>
    <Route name="404" path="*" handler={NotFound}/>
  </Route>
);

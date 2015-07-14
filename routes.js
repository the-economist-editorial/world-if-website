import { Route, Link, RouteHandler } from 'react-router';
import React from 'react';
import App from '@economist/component-world-if-app';

class RouteWrapper extends React.Component {
  render() {
    return (<App><RouteHandler/></App>);
  }
}

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <ul>
          <li><Link to="article" params={{ id: 1 }}>Article 1</Link></li>
          <li><Link to="article" params={{ id: 2 }}>Article 2</Link></li>
          <li><Link to="article" params={{ id: 3 }}>Article 3</Link></li>
          <li><Link to="article" params={{ id: 4 }}>Article 4</Link></li>
        </ul>
      </div>
    );
  }
}

class Article extends React.Component {
  render() {
    return (
      <article>
        <h1>Article</h1>
        <Link to="home">Back home</Link>
      </article>
    );
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
)

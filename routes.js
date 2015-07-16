import { Route, Link, RouteHandler } from 'react-router';
import React from 'react';
import App from '@economist/component-world-if-app';
import Article from '@economist/component-articletemplate';

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
          <li><Link to="article" params={{ id: 5 }}>Article 5</Link></li>
          <li><Link to="article" params={{ id: 6 }}>Article 6</Link></li>
          <li><Link to="article" params={{ id: 7 }}>Article 7</Link></li>
          <li><Link to="article" params={{ id: 8 }}>Article 8</Link></li>
          <li><Link to="article" params={{ id: 9 }}>Article 9</Link></li>
          <li><Link to="article" params={{ id: 10 }}>Article 10</Link></li>
          <li><Link to="article" params={{ id: 11 }}>Article 11</Link></li>
          <li><Link to="article" params={{ id: 12 }}>Article 12</Link></li>
        </ul>
      </div>
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
);

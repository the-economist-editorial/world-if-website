import React from 'react';
import pageTracker from '@economist/react-i13n-omniture/lib/pagetracker';
import Impart from '@economist/component-react-async-container';
import Picture from '@economist/component-picture';
import Tiles from './tiles';
import cache from '@economist/component-react-async-container/lib/cache';
import fetch from 'isomorphic-fetch';
import handleLoading from './loading-handler';
import handleFailure from './failure-handler';

function fetchHomepage() {
  return fetch('/api/homepage').then((response) => (response.json()));
}

function cacheHomepage() {
  return cache('/api/homepage');
}

export function Homepage(response) {
  function isEditionNumber(edition) {
    if (parseInt(edition, 10)) {
      return true;
    }
    return false;
  }
  const { editions, cover, next } = response;
  const tiles = [];
  editions.forEach((edition, index) => {
    if (edition.sections.length) {
      edition.sections.forEach((section) => {
        if (section.tiles.length) {
          tiles.push(
            <section key={`${ section.section }-${ index }`}>
              <Tiles
                comingSoonMessage={next}
                content={section.tiles}
                section={section.section}
              />
            </section>
          );
        }
      });
      if ((editions.length - 1) !== index) {
        const editionText = (isEditionNumber(edition.edition)) ? edition.edition - 1 : edition.edition;
        tiles.push(
          <div
            className="tiles__year-divider"
            key={`edition-divider-${ editionText }`}
          >
              {editionText} <span className="econsans--light">Edition</span>
          </div>
        );
      }
    }
  });
  return (
    <div className="homepage">
      <div className="tiles__wif-intro-container">
        {
          cover.image && cover.image.sources ?
          <Picture
            sources={cover.image.sources}
            alt={cover.image.alt}
          /> : null
        }
        {
          cover.description ?
            <span className="tiles__wif-container">
              <div className="tiles__wif-logo-container">
                <object className="tiles__wif-logo" data="/assets/wif-2016edition-logo.svg"></object>
              </div>
              <div className="tiles__wif-intro">
                {cover.description}
              </div>
            </span> : null
        }
      </div>
      {tiles}
    </div>
  );
}

const TrackedHomepage = pageTracker(Homepage, {
  template: 'channel',
});
export default function HomepageWithData(props) {
  return (
    <Impart.RootContainer
      {...props}
      Component={TrackedHomepage}
      cache={cacheHomepage}
      route={fetchHomepage}
      renderLoading={handleLoading}
      renderFailure={handleFailure}
    />
  );
}

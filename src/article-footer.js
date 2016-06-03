import React from 'react';
import Impart from '@economist/component-react-async-container';
import cache from '@economist/component-react-async-container/lib/cache';
import fetch from 'isomorphic-fetch';
import slugger from 'slugger';
import handleFailure from './failure-handler';
import handleLoading from './loading-handler';
import Teaser from '@economist/component-teaser';
import TeaserImage from '@economist/component-teaser/lib/teaser-image';
import TeaserLink from '@economist/component-teaser/lib/teaser-link';
import TeaserPublishDate from '@economist/component-teaser/lib/teaser-publish-date';
import TeaserTitle from '@economist/component-teaser/lib/teaser-title';

function fetchTiles() {
  return fetch('/api/homepage').then((response) => (response.json()));
}

function cacheTitles() {
  return cache('/api/homepage');
}

export function ArticleFooter({
  editions,
  sectionName,
  sectionDisplayName,
  id,
}) {
  const sluggedSection = slugger(sectionName.replace('World if - ', '')).trim();
  const filteredTiles = [];
  editions.forEach((content) => {
    content.sections.forEach((section) => {
      if (section.section === sluggedSection) {
        section.tiles.forEach((tile) => {
          filteredTiles.push(tile);
        });
      }
    });
  });
  const tileLimit = 4;
  const tiles = filteredTiles
    .filter((tile) => (parseInt(tile.id, 10) !== parseInt(id, 10) && tile.published))
    .slice(0, tileLimit);
  const enableMeta = true;
  return (
    <div className="related">
      <div className="related__header">
        <div className="related__header-inner-left">
          More in <span className="related__section">{sectionDisplayName}</span>
        </div>
        <a className="related__homepage-link" href="/">
          <div className="related__header-inner-right">
            Read more of <em>The World If</em>
            <object className="related__right-arrow" data="/assets/right-arrow.svg"></object>
          </div>
        </a>
      </div>
        <ul className="related__list">
          {tiles.map((tile) => (
            <li className="related__item" key={`${ tile.id }-${ tile.slug }`}>
              <Teaser>
                <TeaserLink href={`/article/${ tile.id }/${ tile.slug }`}>
                  <TeaserImage
                    sources={tile.image.sources}
                    alt={tile.image.src}
                  />
                  <TeaserTitle>{tile.flytitle}</TeaserTitle>
                  <TeaserPublishDate dateTime={new Date()} meta={enableMeta} />
                </TeaserLink>
              </Teaser>
            </li>
          ))}
        </ul>
      <div className="related__footer">
        <a className="related__homepage-link" href="/">
          <div className="related__footer-inner-right">
            Read more of <em>The World If</em>
            <object className="related__right-arrow" data="/assets/right-arrow.svg"></object>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function ArticleFooterWithData(props) {
  return (
    <Impart.RootContainer
      {...props}
      Component={ArticleFooter}
      cache={cacheTitles}
      route={fetchTiles}
      renderLoading={handleLoading}
      renderFailure={handleFailure}
    />
  );
}

if (process.env.NODE_ENV !== 'production') {
  ArticleFooter.propTypes = {
    editions: React.PropTypes.arrayOf(
      React.PropTypes.object,
    ),
    sectionName: React.PropTypes.string,
    sectionDisplayName: React.PropTypes.string,
    id: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
    ]).isRequired,
  };
}

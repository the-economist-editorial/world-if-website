import React from 'react';
import Picture from '@economist/component-picture';
import slugger from 'slugger';

export function sectionLookup(section) {
  const map = {
    'business-economics': 'Business & Economics',
    'history': 'History',
    'politics': 'Politics',
    'science-technology': 'Science & Technology',
  };
  return map[section] || section;
}

export default function Tile({
  id,
  slug,
  section,
  sluggedSectionName = slugger(section),
  flytitle,
  rubric,
  image,
  published = true,
  sectionDisplayName = sectionLookup(section),
  comingSoonMessage,
}) {
  let sectionEl = null;
  if (section) {
    sectionEl = (
      <div
        className={`tiles__section tiles__section--${ sluggedSectionName }`}
      >
        {sectionDisplayName}
      </div>
    );
  }

  let flytitleEl = null;
  if (flytitle) {
    flytitleEl = <div className="tiles__flytitle">{flytitle}</div>;
  }

  let rubricEl = null;
  if (rubric) {
    rubricEl = <div className="tiles__rubric">{rubric}</div>;
  }

  let content = null;
  if (sectionEl || flytitleEl || rubricEl) {
    content = (
      <div className="tiles__content-container">
        {sectionEl}
        {flytitleEl}
        {rubricEl}
      </div>
    );
  }

  let pictureEl = null;
  if (image && image.sources && image.sources.length) {
    pictureEl = (
      <div className="tiles__image-container">
        <Picture {...image} className="tiles__image" />
      </div>
    );
  }

  const publishedTile = (published) ? 'tiles__item--published' : 'tiles__item--unpublished';
  return (
    <div className={`tiles__item ${ publishedTile }`}>
      <div className="tiles__item-inner">
        {
          published ?
          <a href={`article/${ id }/${ slug }`} className="tiles__link">
            {pictureEl}
            {content}
          </a> :
          <span>
          {pictureEl}
          {content}
            <div className="tiles__unpublished-message-container">
              <div
                className="tiles__unpublished-message"
                dangerouslySetInnerHTML={({ __html: comingSoonMessage })} // eslint-disable-line
              />
            </div>
          </span>
        }
      </div>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Tile.propTypes = {
    id: React.PropTypes.number.isRequired,
    slug: React.PropTypes.string.isRequired,
    section: React.PropTypes.string,
    sluggedSectionName: React.PropTypes.string,
    flytitle: React.PropTypes.string,
    rubric: React.PropTypes.string,
    image: React.PropTypes.shape(
      Picture.propTypes,
    ),
    published: React.PropTypes.bool,
    sectionDisplayName: React.PropTypes.string,
    comingSoonMessage: React.PropTypes.string,
  };
}

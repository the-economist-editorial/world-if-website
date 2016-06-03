import Picture from '@economist/component-picture';
import React from 'react';

export default function ArticleHeader({
  mainImage,
  flytitle,
  title,
  sectionDisplayName,
}) {
  let flytitleEl = null;
  let titleEl = null;
  let mainImageEl = null;
  let sectionNameEl = null;
  if (sectionDisplayName) {
    sectionNameEl = (
      <div
        itemProp="section"
        className="article-template__section-name"
      >
        {sectionDisplayName}
      </div>
    );
  }

  if (flytitle) {
    flytitleEl = (
      <div
        itemProp="headline"
        aria-hidden="true"
        className="article-template__flytitle"
      >
        {flytitle}
      </div>
    );
  }

  if (title) {
    titleEl = (
      <h1
        itemProp="alternativeHeadline"
        aria-label={`${ flytitle } ${ title }`}
        className="article-template__title"
      >
        {title}
      </h1>
    );
  }

  if (mainImage) {
    mainImageEl = (
      <Picture
        className="article-template__image"
        itemProp="image"
        {...mainImage}
      />
    );
  }

  return (
    <div className="article-template__header">
      {mainImageEl}
      <header className="article-template__header-content">
        {sectionNameEl}
        {flytitleEl}
        {titleEl}
      </header>
    </div>
  );
}

if (process.env.NODE_ENV !== 'production') {
  ArticleHeader.propTypes = {
    mainImage: React.PropTypes.shape(Picture.propTypes || {}),
    sectionDisplayName: React.PropTypes.string,
    flytitle: React.PropTypes.string,
    title: React.PropTypes.string,
  };
}

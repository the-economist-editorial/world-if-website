import React from 'react';
import AdvertisementPanel from '@economist/component-ad-panel';
import ArticleTemplateBody from '@economist/component-articletemplate/lib/body';
import ImageCaption from '@economist/component-imagecaption';
import Video from '@economist/component-video';
import Gobbet from '@economist/component-gobbet';

export function GobbetWithData({
  sources,
  alt,
}) {
  return (
    <Gobbet>
      <ImageCaption
        className="gobbet__figure"
        sources={sources}
        alt={alt}
      />
    </Gobbet>
  );
}

if (process.env.NODE_ENV !== 'production') {
  GobbetWithData.propTypes = {
    sources: React.PropTypes.arrayOf(
      React.PropTypes.object,
    ).isRequired,
    alt: React.PropTypes.string,
  };
}

export function ArticleSubHead({
  content,
}) {
  return (
    <h3 className="crosshead">
      {content}
    </h3>
  );
}

if (process.env.NODE_ENV !== 'production') {
  ArticleSubHead.propTypes = {
    content: React.PropTypes.string.isRequired,
  };
}

export function Pullquote({
  content,
}) {
  return (
    <blockquote className="pullquote">
      {content}
    </blockquote>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Pullquote.propTypes = {
    content: React.PropTypes.string.isRequired,
  };
}

export default function ArticleBody(rest) {
  const props = {
    components: {
      AdvertisementPanel,
      ImageCaption,
      Video,
      Gobbet: GobbetWithData,
      ArticleSubHead,
      Pullquote,
    },
    ...rest,
  };
  return (
    <ArticleTemplateBody {...props} />
  );
}

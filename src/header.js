import React from 'react';
import Navigation from '@economist/component-navigation';
import Icon from '@economist/component-icon';
import StickyPosition from 'react-sticky-position';

export default function HeaderWithData() {
  return (
    <StickyPosition>
      <Navigation
        logo={
          <a href="http://www.economist.com" className="navigation__link-logo">
            <Icon icon="economist" src="/assets/icons.svg#economist" />
          </a>
        }
      >
        <div className="navigation__extra-inner">
          <a
            href="https://subscriptions.economist.com"
            className="navigation__link-subscribe"
            i13nModel={{
              action: 'click',
              element: 'subscribe',
            }}
          >Subscribe</a>
          <a href="/" className="navigation__link-sub-brand">
            <img
              src="/assets/logo-world-if.svg"
              className="navigation__sub-brand-logo"
            />
          </a>
        </div>
      </Navigation>
    </StickyPosition>
  );
}

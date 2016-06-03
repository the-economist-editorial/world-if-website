import React from 'react';
import Footer from '@economist/component-footer';

const links = {
  customer: [
    {
      title: 'Subscribe',
      href: 'https://subscriptions.economist.com',
    },
    {
      title: 'Contact us',
      href: 'http://www.economist.com/contact-info',
    },
    {
      title: 'Help',
      href: 'http://www.economist.com/help/home',
    },
  ],
  economist: [
    {
      title: 'Advertise',
      href: 'http://marketingsolutions.economist.com',
    },
    {
      title: 'Careers',
      href: 'http://economistgroupcareers.com',
    },
    {
      title: 'Site Map',
      href: 'http://www.economist.com/content/site-index',
    },
    {
      title: 'Reprints',
      href: 'http://www.economist.com/rights',
    },
    {
      title: 'Editorial Staff',
      href: 'http://mediadirectory.economist.com',
    },
  ],
  social: [
    {
      title: 'Facebook',
      meta: 'facebook',
      href: 'https://www.facebook.com/TheEconomist',
      internal: false,
    },
    {
      title: 'Twitter',
      meta: 'twitter',
      href: 'https://twitter.com/TheEconomist',
      internal: false,
    },
    {
      title: 'Google',
      meta: 'googleplus',
      href: 'https://plus.google.com/+TheEconomist',
      internal: false,
    },
    {
      title: 'Linkedin',
      meta: 'linkedin',
      href: 'https://www.linkedin.com/groups/3056216',
      internal: false,
    },
    {
      title: 'Instagram',
      meta: 'instagram',
      href: 'https://www.instagram.com/theeconomist',
      internal: false,
    },
    {
      title: 'Youtube',
      meta: 'youtube',
      href: 'https://www.youtube.com/user/economistmagazine',
      internal: false,
    },
    {
      title: 'rss',
      meta: 'rss',
      href: 'https://www.economist.com',
      internal: false,
    },
  ],
  business: [
    {
      title: 'Terms of Use',
      href: 'http://www.economist.com/legal/terms-of-use',
    },
    {
      title: 'Privacy',
      href: 'http://www.economistgroup.com/results_and_governance/governance/privacy/',
    },
    {
      title: 'Cookies',
      href: 'http://www.economist.com/cookies-info',
    },
    {
      title: 'Accessibility',
      href: 'http://www.economist.com/help/accessibilitypolicy',
    },
  ],
};
const quote = 'Published since September 1843 to take part in <br/><em>“a severe ' +
  'contest between intelligence, which presses forward,<br/>and an unworthy, timid ' +
  'ignorance obstructing our progress.”</em>';
export default function FooterWithData() {
  return (
    <Footer data={links} quote={quote} />
  );
}

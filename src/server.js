import 'babel-polyfill';
import React from 'react';
import { match, RouterContext } from 'react-router';
import { createRoutesFromReactChildren } from 'react-router/lib/RouteUtils';
import standardServer from '@economist/standard-server';
import reactHtmlTemplate from '@economist/connect-react-html-template';
import proxy from '@economist/connect-api-proxy-middleware';
import assets from './assets';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import url from 'url';
import { configureCache } from '@economist/component-react-async-container/lib/cache';
import fetch from 'isomorphic-fetch';
import zipObject from 'lodash.zipobject';
import serialize from 'serialize-javascript';
import UrlPattern from 'url-pattern';
import slugger from 'slugger';
import Routes from './routes';
import NotFoundHandler from './not-found-handler';
import Article from './article';
const routes = createRoutesFromReactChildren([
  Routes,
]);
const server = module.exports = standardServer();
const proxyUrl = `${ server.config.proxy.domain }${ server.config.proxy.path }`;
const economistProxy = proxy(proxyUrl);
const cache = configureCache(server.config.cache || {}).start().cache;
function formatDateAsString(date) {
  return moment(date).tz('Europe/London').format('MMM Do YYYY, HH:mm');
}

function redirectMap(id) {
  id = parseInt(id, 10);
  const map = {
    1: '12113/first-100-days',
    2: '12114/peril-beyond-putin',
    3: '12115/article-faith',
    6: '12117/clash-currencies',
    7: '12119/squeezing-rich',
    8: '12120/trench-warfare-nicaragua',
    9: '12122/boom-or-gloom',
    11: '12123/horseless-driverless',
    12: '12125/taking-hit',
    13: '12127/billion-person-question',
    14: '12128/imagine-all-empowered-people',
    15: '12140/video-feature',
    16: '12130/chiangs-china',
    17: '12141/audio-feature',
  };
  return map[id] || false;
}

server.log.info(server.config, 'booting with config');
server
  .use('/api/article', economistProxy('node', {
    headerOverrides: {
      'cache-control': 'public, max-age=60',
    },
    dataOverrides: (article) => ({
      id: article.data.id,
      slug: article.data.attributes.slug || slugger(article.data.attributes.title),
      title: article.data.attributes.title,
      flytitle: article.data.attributes.flytitle,
      rubric: article.data.attributes.rubric,
      byline: article.data.attributes.byline,
      bylineLocation: article.data.attributes.byline_location,
      bio: article.data.attributes.bio,
      publishDate: {
        raw: article.data.attributes.publishDate,
        formatted: formatDateAsString(article.data.attributes.publishDate),
      },
      mainImage: article.data.attributes.mainimage,
      content: article.data.attributes.content,
      sectionName: slugger(article.data.attributes.section.replace(/World If - /gi, '').trim()),
      sectionDisplayName: article.data.attributes.section.replace(/World If - /gi, '').trim(),
      variantName: article.data.attributes.variantName || 'world-if',
      metaTags: article.data.attributes.metaTags,
    }),
  }))
  .use('/api/homepage', economistProxy('custom_data/wif_homepage', {
    headerOverrides: {
      'cache-control': 'public, max-age=60',
    },
    dataOverrides: (homepage) => ({
      metaTags: homepage.data.attributes.metaTags,
      editions: homepage.content.editions,
      cover: homepage.content.cover,
      next: homepage.content.settings.coming_next,
    }),
  }))
  .use('/', (request, response, next) => {
    function getFromCacheOrUrl(path) {
      const cacheInstance = cache(path);
      const cacheData = cacheInstance.get();
      if (cacheData) {
        return Promise.resolve([ path, cacheData ]);
      }
      const defaultPortNumber = 8080;
      const serverUrl = url.format({
        protocol: 'http',
        hostname: 'localhost',
        port: server.config.port || defaultPortNumber,
      });
      const apiUrl = url.resolve(serverUrl, path);
      return fetch(apiUrl).then((fetchResponse) => (
        fetchResponse.json()
      )).then((cachedData) => {
        cacheInstance.set(cachedData);
        return [ path, cachedData ];
      });
    }

    function generateDataRequirements(requestPath, id) {
      const articlepageRoute = new UrlPattern('/article/:id(/:slug)');
      const homepageRoute = new UrlPattern('/');
      const isArticlePage = Boolean(articlepageRoute.match(requestPath));
      const isHomepage = Boolean(homepageRoute.match(requestPath));
      const dataRequirements = [];
      if (isArticlePage) {
        dataRequirements.push(getFromCacheOrUrl('/api/homepage'));
        dataRequirements.push(getFromCacheOrUrl(`/api/article/${ id }`));
      } else if (isHomepage) {
        dataRequirements.push(getFromCacheOrUrl('/api/homepage'));
      }

      return dataRequirements;
    }

    function generateInlineScript(listOfUrlDataTuples) {
      const urlToDataObject = zipObject(listOfUrlDataTuples);
      return `var serverCache = ${ serialize(urlToDataObject) };`;
    }

    /* eslint-disable consistent-return */
    match({ routes, location: request.url }, (matchError, redirectLocation, renderProps) => {
      if (matchError) {
        response.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        response.end(matchError.message);
      } else if (renderProps) {
        const children = <RouterContext {...renderProps} />;
        const requestPathname = renderProps.location.pathname;
        const { id, slug } = renderProps.params;
        const dataRequirements = generateDataRequirements(requestPathname, id);
        const routeComponent = renderProps.routes[1].component || {};
        const isNotFound = routeComponent === NotFoundHandler;
        const isArticlePage = routeComponent === Article;
        if (isNotFound) {
          response.statusCode = httpStatus.NOT_FOUND;
        }
        const redirect = redirectMap(id);
        if (isArticlePage && redirect) {
          // it's likely these will fail locally or anywhere that's using dev2-cms-worldin as the data isn't there
          const articleRedirectUrl = `/article/${ redirect }`;
          response.writeHead(httpStatus.MOVED_PERMANENTLY, {
            'Location': articleRedirectUrl,
          });
          response.end();
          return true;
        }
        return Promise.all(dataRequirements).then((listOfUrlDataTuples) => {
          listOfUrlDataTuples = listOfUrlDataTuples || [];
          // [
          //   ['/homepage', object]
          // ]
          // [
          //   ['/homepage', object]
          //   ['/article/id/slug', object],
          // ]
          let mainContentData = {};
          if (Array.isArray(listOfUrlDataTuples)) {
            mainContentData = listOfUrlDataTuples[0][1];
            if (isArticlePage) {
              mainContentData = listOfUrlDataTuples[1][1];
            }
          }

          if (isArticlePage && !slug) {
            const sluggedUrl = `/article/${ mainContentData.id }/${ slugger(mainContentData.slug) }`;
            response.writeHead(httpStatus.MOVED_PERMANENTLY, {
              'Location': sluggedUrl,
            });
            response.end();
            return true;
          }
          const metaTags = mainContentData.metaTags || [];
          metaTags.forEach((metaItem) => {
            metaItem['data-meta'] = true;
          });
          const title = (metaTags.find((tag) => tag.property === 'og:title') || {}).content;
          const meta = [
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
              'data-meta': true,
            },
          ].concat(metaTags);
          const headers = {
            'cache-control': 'public, max-age=60',
          };
          const serverCacheInlineScript = generateInlineScript(listOfUrlDataTuples);
          return reactHtmlTemplate({
            headers,
            props: {
              children,
              title,
              meta,
              styles: [
                `/${ assets.style }`,
              ],
              inlineScripts: [
                serverCacheInlineScript,
              ],
              scripts: [
                `/${ assets.vendor }`,
                `/${ assets.client }`,
              ],
            },
          })(request, response, next);
        }).catch((dataError) => {
          next(dataError);
        });
      } else {
        const routeError = new Error(`Route ${ request.url } did not match!`);
        routeError.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        response.end(routeError.message);
      }
    });
    /* eslint-enable consistent-return */
  })
  .use(server.log.errorLogger());

if (require.main === module) {
  server.start();
}

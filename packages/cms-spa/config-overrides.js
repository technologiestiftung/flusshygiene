// // config-overrides.js
const {
  addWebpackAlias,
  useBabelRc,
  override,
  addWebpackModuleRule,
} = require('customize-cra');
const path = require('path');

// const supportMjs = () => (webpackConfig) => {
//   webpackConfig.module.rules.push({
//     test: /\.mjs$/,
//     include: /node_modules/,
//     type: 'javascript/auto',
//   });
//   return webpackConfig;
// };

// module.exports = override(supportMjs());
// see https://github.com/reactioncommerce/reaction-component-library/issues/399
module.exports = override(
  addWebpackModuleRule({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  }),
  // see https://github.com/uber/deck.gl/blob/master/examples/get-started/react/mapbox/webpack.config.js
  addWebpackAlias({
    'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
  }),
  useBabelRc(),
);

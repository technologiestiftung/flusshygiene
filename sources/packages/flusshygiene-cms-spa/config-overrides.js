// // config-overrides.js
// const { override } = require('customize-cra');

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
module.exports = function override(webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  });

  return webpackConfig;
};

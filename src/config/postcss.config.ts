import { context, postCSS } from "./target.config";

// webpack.config.js
// https://github.com/postcss/postcss-loader/tree/v2.0.5

module.exports = (loader: any) => ([
  // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
  // https://github.com/postcss/postcss-import
  require("postcss-import")({ path: context }),

  // https://github.com/maximkoretskiy/postcss-initial
  // This is polyfill for css rule: "all: initial".
  require("postcss-initial")({ reset: "inherited" }),

  // PostCSS plugin to transform :not() W3C CSS leve 4 pseudo class to :not() CSS level 3 selectors
  // http://dev.w3.org/csswg/selectors-4/#negation
  // https://github.com/postcss/postcss-selector-not
  require("postcss-selector-not")(),

  // W3C color() function, e.g. div { background: color(red alpha(90%)); }
  // https://github.com/postcss/postcss-color-function
  require("postcss-color-function")(),

  // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
  // https://github.com/postcss/postcss-custom-media
  require("postcss-custom-media")(),

  // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
  // https://github.com/postcss/postcss-media-minmax
  require("postcss-media-minmax")(),

  // Postcss flexbox bug fixer
  // https://github.com/luisrudge/postcss-flexbugs-fixes
  require("postcss-flexbugs-fixes")(),

  // Add vendor prefixes to CSS rules using values from caniuse.com
  // https://github.com/postcss/autoprefixer
  require("autoprefixer")([">0.1%"]),

  ...postCSS.plugins.list,
]);

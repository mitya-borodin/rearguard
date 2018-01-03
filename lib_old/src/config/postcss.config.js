"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const target_config_1 = require("./target.config");
module.exports = (loader) => ([
    require("postcss-import")({ path: target_config_1.context }),
    require("postcss-initial")({ reset: "inherited" }),
    require("postcss-selector-not")(),
    require("postcss-color-function")(),
    require("postcss-custom-media")(),
    require("postcss-media-minmax")(),
    require("postcss-flexbugs-fixes")(),
    require("autoprefixer")([">0.1%"]),
    ...target_config_1.postCSS.plugins.list,
]);
//# sourceMappingURL=postcss.config.js.map
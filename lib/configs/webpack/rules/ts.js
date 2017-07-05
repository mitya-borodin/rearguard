'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prepareBuildTools = require('../../prepare.build-tools.config');

exports.default = ({ test = /\.(ts|tsx)?$/, exclude = [/node_modules/] }) => [{
  test,
  loader: 'awesome-typescript-loader',
  exclude,
  include: [_prepareBuildTools.context],
  options: {
    configFileName: '',
    compilerOptions: {
      'version': '2.4.1',
      'compilerOptions': {
        'target': 'es6',
        'module': 'es6',
        'allowJs': false,
        'allowSyntheticDefaultImports': true,
        'preserveConstEnums': true,
        'sourceMap': true,
        'moduleResolution': 'node',
        'lib': ['es6', 'es7', 'dom'],
        'types': ['inferno'],
        'jsx': 'preserve',
        'noUnusedLocals': true,
        'strictNullChecks': true,
        'removeComments': false
      },
      'include': [`${_prepareBuildTools.context}/**/*`],
      'exclude': ['node_modules'],
      'compileOnSave': false
    }
  }
}, {
  enforce: 'pre',
  test: /\.(js|jsx)?$/,
  loader: 'source-map-loader',
  exclude,
  include: [_prepareBuildTools.context]
}];
//# sourceMappingURL=ts.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const getTSPlugins = exports.getTSPlugins = () => {
  if (!isIsomorphic) {
    return [new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'head'
    })];
  }

  return [];
};
//# sourceMappingURL=ts.js.map
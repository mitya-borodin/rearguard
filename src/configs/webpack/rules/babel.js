import { context, isDevelopment, isMobx } from '../../prepare.build-tools.config';

export default (test = /\.(js)?$/,
                presets = [],
                plugins = [],
                envPreset = [],
                exclude = [/node_modules/]) => ({
  test,
  loader: 'babel-loader',
  exclude,
  include: [context],
  query: {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: isDevelopment,

    // https://babeljs.io/docs/usage/options/
    babelrc: false,
    // TODO как заработает внедрить https://github.com/mobxjs/babel-plugin-mobx-deep-action/issues/5
    //passPerPreset: true,
    presets: [
      // TODO как заработает внедрить https://github.com/mobxjs/babel-plugin-mobx-deep-action/issues/5
      //...isMobx ? [{ plugins: ['transform-regenerator', 'mobx-deep-action'] }] : [],
      envPreset,
      // Stage 2: draft
      // https://babeljs.io/docs/plugins/preset-stage-2/
      'stage-2',
      ...presets
    ],
    plugins: [
      ...isMobx ? ['transform-decorators-legacy'] : [],
      ...plugins
    ],
  },
})

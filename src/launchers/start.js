import * as browserSync from 'browser-sync';
import * as compress from 'compression';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as WDS from 'webpack-dev-server';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as WriteFilePlugin from 'write-file-webpack-plugin';
import { host, isDebug, isDevelopment, isIsomorphic, onlyServer, port, socket, webpackMiddlewareConfig, WDSConfig } from '../config/target.config';
import buildTypescriptConfig from '../config/typescript.config.builder';
import webpackConfig from '../config/webpack.config';
import clean from './clean';
import copy from './copy';
import runServer from './runServer';

const target = `${host}:${port}`;
const bs = browserSync.create();

buildTypescriptConfig();

if (isIsomorphic) {
  clean()
  .then(() => copy())
  .then(() => {
    if (onlyServer) {
      // Save the server-side bundle files to the file system after compilation
      // https://github.com/webpack/webpack-dev-server/issues/62
      webpackConfig.plugins.push(new WriteFilePlugin({ log: isDebug }));

      const bundler = webpack(webpackConfig);
      const wpMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareConfig);
      const hotMiddleware = webpackHotMiddleware(bundler, webpackMiddlewareConfig);

      let handleBundleComplete = (stats) => {
        handleBundleComplete = stats => !stats.compilation.errors.length && runServer(target);

        runServer(target)
        .then(() => {
          bs.init({
            ...isDevelopment ? {} : { notify: isDebug, ui: isDebug },
            proxy: {
              target,
              middleware: [compress(), wpMiddleware, hotMiddleware],
            },
          });
        })
        .catch(error => console.error(error));
      };

      bundler.plugin('done', stats => handleBundleComplete(stats));
    } else {
      const [, serverConfig] = webpackConfig;

      // Save the server-side bundle files to the file system after compilation
      // https://github.com/webpack/webpack-dev-server/issues/62
      serverConfig.plugins.push(new WriteFilePlugin({ log: isDebug }));

      const bundler = webpack(webpackConfig);
      const wpMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareConfig);
      const hotMiddleware = webpackHotMiddleware(bundler.compilers[0], webpackMiddlewareConfig);

      let handleBundleComplete = (stats) => {
        handleBundleComplete = (stats) => !stats.stats[1].compilation.errors.length && runServer(target);

        runServer(target)
        .then(() => {
          bs.init({
            ...isDevelopment ? {} : { notify: isDebug, ui: isDebug },
            proxy: {
              target,
              middleware: [compress(), wpMiddleware, hotMiddleware],
            },
          });
        })
        .catch(error => console.error(error));
      };

      bundler.plugin('done', stats => handleBundleComplete(stats));
    }
  }, (error) => {
    console.error(error);
  });
} else {
  const server = new WDS(webpack(webpackConfig), WDSConfig);

  server.listen(port, host, () => console.log(`Launched on ${socket}`));
}

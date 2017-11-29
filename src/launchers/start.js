import * as browserSync from 'browser-sync';
import * as compress from 'compression';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as WDS from 'webpack-dev-server';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as WriteFilePlugin from 'write-file-webpack-plugin';
import * as chalk from 'chalk';
import {
  host,
  isDebug,
  isDevelopment,
  isIsomorphic,
  onlyServer,
  port,
  socket,
  WDSConfig,
  webpackMiddlewareConfig
} from '../config/target.config';
import buildTypescriptConfig from '../config/typescript.config.builder';
import webpackConfig from '../config/webpack.config';
import clean from './clean';
import copy from './copy';
import runServer from './runServer';
import makeProxies from './makeProxies';
import typedCSS from './typedCSS';

const target = `${host}:${port}`;
const bs = browserSync.create();

buildTypescriptConfig();

if (isIsomorphic || onlyServer) {
  clean()
    .then(() => copy())
    .then(() => typedCSS(true))
    .then(() => {
        if (onlyServer) {
          // Save the server-side bundle files to the file system after compilation
          // https://github.com/webpack/webpack-dev-server/issues/62
          webpackConfig.plugins.push(new WriteFilePlugin({log: isDebug}));

          const bundler = webpack(webpackConfig);
          const wpMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareConfig);
          const hotMiddleware = webpackHotMiddleware(bundler, webpackMiddlewareConfig);

          let handleBundleComplete = (stats) => {
            handleBundleComplete = stats => !stats.compilation.errors.length && runServer(target);

            runServer(target)
              .then(() => {
                bs.init(
                  {
                    ...isDevelopment ? {} : {notify: isDebug, ui: isDebug},
                    proxy: {
                      target,
                      middleware: [compress(), ...makeProxies(), wpMiddleware, hotMiddleware],
                    },
                  },
                  () => typedCSS()
                );
              })
              .catch(error => console.error(error));
          };

          bundler.plugin('done', stats => handleBundleComplete(stats));
        } else if (isIsomorphic) {
          const [, serverConfig] = webpackConfig;

          // Save the server-side bundle files to the file system after compilation
          // https://github.com/webpack/webpack-dev-server/issues/62
          serverConfig.plugins.push(new WriteFilePlugin({log: isDebug}));

          const bundler = webpack(webpackConfig);
          const wpMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareConfig);
          const hotMiddleware = webpackHotMiddleware(bundler.compilers[0], webpackMiddlewareConfig);

          let handleBundleComplete = (stats) => {
            handleBundleComplete = (stats) => !stats.stats[1].compilation.errors.length && runServer(target);

            runServer(target)
              .then(() => {
                bs.init(
                  {
                    ...isDevelopment ? {} : {notify: isDebug, ui: isDebug},
                    proxy: {
                      target,
                      middleware: [compress(), ...makeProxies(), wpMiddleware, hotMiddleware],
                    },
                  },
                  () => typedCSS()
                );
              })
              .catch(error => console.error(error));
          };

          bundler.plugin("done", stats => handleBundleComplete(stats));
        } else {
          console.error("Expected isomorphic more or only server mode.");
        }
      },
      (error) => {
        console.error(error);
      }
    );
} else {
  typedCSS(true);

  const server = new WDS(webpack(webpackConfig), WDSConfig);

  server.listen(port, host, () => {
    console.log(chalk.bold.blue(`[REARGUARD][WDS][LAUNCHED][ON][${socket}]`));

    typedCSS();
  });

}

import browserSync from 'browser-sync';
import compress from 'compression';
import webpack from 'webpack';
import WDS from 'webpack-dev-server';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import WriteFilePlugin from 'write-file-webpack-plugin';
import {
  host,
  isDebug,
  isDevelopment,
  isIsomorphic,
  port,
  //proxyServer,
  socket
} from '../../configs/prepare.build-tools.config';
import prepareTypescriptConfig from '../../configs/prepareTypescriptConfig';
//import runProxyServer from '../../configs/utils/runProxyServer';
import runServer from '../../configs/utils/runServer';
import webpackDevServerConfig from '../../configs/webpack/webpack.devserver.config';
import run from '../run';
import clean from './clean';
import copy from './copy';
//import makeServerConfig from './makeServerConfig';

function start (webpackConfig) {
  prepareTypescriptConfig();

  const target = `${host}:${port}`;

  if (isIsomorphic) {
    run(clean)
    .then(() => run(copy))
    .then(() => {

      const [, serverConfig] = webpackConfig;

      // Save the server-side bundle files to the file system after compilation
      // https://github.com/webpack/webpack-dev-server/issues/62
      serverConfig.plugins.push(new WriteFilePlugin({ log: isDebug }));

      const bundler = webpack(webpackConfig);
      const wpMiddleware = webpackDevMiddleware(bundler, webpackDevServerConfig);
      const hotMiddleware = webpackHotMiddleware(bundler.compilers[0], webpackDevServerConfig);

      let handleBundleComplete = () => {
        handleBundleComplete = stats => !stats.stats[1].compilation.errors.length && runServer();

        runServer(target).then(() => {
          const bs = browserSync.create();

          bs.init({
            ...isDevelopment ? {} : { notify: isDebug, ui: isDebug },

            proxy: {
              target,
              middleware: [compress(), wpMiddleware, hotMiddleware],
              proxyOptions: {
                xfwd: true,
              },
            },
          });
        });
      };

      bundler.plugin('done', stats => handleBundleComplete(stats));
    }, (error) => {
      console.error(error);
    });
  } else {
    const server = new WDS(webpack(webpackConfig), webpackDevServerConfig);

    server.listen(port, host, () => console.log(`Launched on ${socket}`));
  }
/*    makeServerConfig(proxyServer.output)
    .then(() => {
      const bundler = webpack(webpackConfig);
      const wpMiddleware = webpackDevMiddleware(bundler, webpackDevServerConfig);
      const hotMiddleware = webpackHotMiddleware(bundler, webpackDevServerConfig);

      let handleBundleComplete = () => {
        handleBundleComplete = () => null;

        runProxyServer().then(() => {
          const bs = browserSync.create();

          bs.init({
            ...isDevelopment ? {} : { notify: isDebug, ui: isDebug },

            proxy: {
              target,
              middleware: [compress(), wpMiddleware, hotMiddleware],
            },
          });
        });
      };

      bundler.plugin('done', stats => handleBundleComplete(stats));
    });
  }*/
}

export default start;

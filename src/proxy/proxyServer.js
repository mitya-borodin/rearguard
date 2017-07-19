import express from 'express';
import httpProxy from 'http-proxy';
import config from './config.json'; // eslint-disable-line import/no-unresolved

const app = express();
const proxy = httpProxy.createProxyServer();

//
// Register Proxy
// -----------------------------------------------------------------------------
config.proxy.forEach(({ route, target }) => {
  app.use(route, (req, res) => {
    proxy.web(req, res, { target, changeOrigin: true });
  });
});

//
// Launch the server
// -----------------------------------------------------------------------------

app.listen(parseInt(config.port), config.host, () => console.info(config.serverWasRunDetectString));

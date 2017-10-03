import * as path from "path";
import {port, proxy} from "../config/target.config";
import {writeFile} from "../lib/fs";

async function makeServerConfig(output: string) {
  await writeFile(
    path.resolve(output, "config.js"),
    `const proxy = require('http-proxy-middleware');

const config = {
  port: parseInt(process.env.PORT) || ${port},
  proxy: ${
    JSON.stringify(Object.keys(proxy).map((key) => ({
      route: key,
      target: proxy[key],
      })), null, 2)
    }
};
const proxies = [];

config.proxy.forEach(({ route, target }) => {
  if (Object.prototype.toString.call(target) === '[object Object]') {
    proxies.push(proxy(route, target));
  }
  if (Object.prototype.toString.call(target) === '[object String]') {
    proxies.push(proxy(route, { target, changeOrigin: true }));
  }
});

module.exports.port = config.port;
module.exports.applyProxies = (app) => proxies.forEach((proxy) => app.use(proxy));
`);

  await writeFile(
    path.resolve(output, "config.json"),
    JSON.stringify(
      {
        port,
        proxy: Object
          .keys(proxy)
          .map((key) => ({route: key, target: proxy[key]}),
          ),
      },
      null,
      2,
    ),
  );
}

export default makeServerConfig;

import * as proxy from "http-proxy-middleware";
import {proxy as proxyConfigs} from "../config/target.config";

const proxies: any[] = [];

export default () => {
  if (proxies.length > 0) {
    return proxies;
  }

  Object.keys(proxyConfigs).forEach((route: string) => {
    if (Object.prototype.toString.call(proxyConfigs[route]) === "[object Object]") {
      proxies.push(proxy(route, proxyConfigs[route]));
    }
    if (Object.prototype.toString.call(proxyConfigs[route]) === "[object String]") {
      proxies.push(proxy(route, {target: proxyConfigs[route], changeOrigin: true}));
    }
  });

  return proxies;
};

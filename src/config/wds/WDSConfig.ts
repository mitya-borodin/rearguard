import { isNumber, isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { IWDSConfig } from "../../interfaces/config/IWDSConfig";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class WDSConfig extends NonVersionableConfig implements IWDSConfig {
  public get host(): string {
    const { host } = this.wds;

    if (isString(host) && host.length > 0) {
      return host;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ CONFIG ][ HOST ][ WARNING ][ must be a not empty string ]`));

    this.wds = { host: "localhost" };

    console.log(chalk.bold.green(`[ CONFIG ][ HOST ][ ASSIGN_TO ][ 'localhost' ]`));

    return this.host;
  }

  public get port(): number {
    const { port } = this.wds;

    if (isNumber(port)) {
      return port;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ CONFIG ][ PORT ][ WARNING ][ must be a number ]`));

    this.wds = { port: 3000 };

    console.log(chalk.bold.green(`[ CONFIG ][ PORT ][ ASSIGN_TO ][ 3000 ]`));

    return this.port;
  }

  public get proxy(): { [key: string]: any } {
    const { proxy } = this.wds;

    if (isObject(proxy) && Object.keys(proxy).length > 0) {
      return proxy;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ CONFIG ][ PROXY ][ WARNING ][ must be defined ]`));

    this.wds = {
      proxy: {
        "/api": "http://localhost:10000",
        "/ws": {
          changeOrigin: true,
          target: "ws://localhost:10001",
          ws: true,
        },
      },
    };

    console.log(chalk.bold.yellow(`[ CONFIG ][ PROXY ][ ASSIGN_TO ][ default ]`));

    return this.proxy;
  }

  private get wds(): { [key: string]: any } {
    const { wds } = this.config;

    if (wds) {
      return wds;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ CONFIG ][ WDS ][ WARNING ][ must be defined ]`));

    this.config = { wds: {} };

    console.log(chalk.bold.yellow(`[ CONFIG ][ WDS ][ WRITE ][ assign to '{}' ]`));

    return this.wds;
  }

  private set wds(params: { [key: string]: any }) {
    this.config = { wds: { ...this.wds, ...params } };
  }
}

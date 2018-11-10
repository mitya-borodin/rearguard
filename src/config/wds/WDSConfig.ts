import { isNumber, isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class WDSConfig extends NonVersionableConfig {
  public get host(): string {
    const { host } = this.wds;

    if (isString(host) && host.length > 0) {
      return host;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ HOST ][ WARNING ][ host must be a not empty string ]`));

    this.wds = { host: "localhost" };

    console.log(chalk.bold.green(`[ WDS_CONFIG ][ HOST ][ WRITE ][ host assigned 'localhost' ]`));
    console.log(chalk.green(JSON.stringify(this.wds, null, 2)));

    return this.host;
  }

  public get port(): number {
    const { port } = this.wds;

    if (isNumber(port)) {
      return port;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ PORT ][ WARNING ][ port must be a number ]`));

    this.wds = { port: 3000 };

    console.log(chalk.bold.green(`[ WDS_CONFIG ][ PORT ][ WRITE ][ PORT assigned '3000' ]`));
    console.log(chalk.green(JSON.stringify(this.config, null, 2)));

    return this.port;
  }

  public get proxy(): { [key: string]: any } {
    const { proxy } = this.wds;

    if (isObject(proxy) && Object.keys(proxy).length > 0) {
      return proxy;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ PROXY ][ WARNING ][ proxy must be defined ]`));

    this.wds = {
      proxy: {
        "/service": "http://localhost:10000",
        "/ws": {
          changeOrigin: true,
          target: "ws://localhost:10001",
          ws: true,
        },
      },
    };

    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ PROXY ][ WRITE ][ proxy assigned default settings ]`));
    console.log(chalk.green(JSON.stringify(this.wds, null, 2)));

    return this.proxy;
  }

  private get wds(): { [key: string]: any } {
    const { wds } = this.config;

    if (wds) {
      return wds;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ WARNING ][ wds must be defined ]`));

    return {};
  }

  private set wds(params: { [key: string]: any }) {
    this.config = { wds: { ...this.wds, ...params } };
  }
}

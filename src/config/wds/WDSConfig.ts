import { isNumber, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class WDSConfig extends NonVersionableConfig {
  public get host(): string {
    const { host } = this.wds;

    if (isString(host) && host.length > 0) {
      return host;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ WARNING ][ wds.host ][ MUST_BE_A_NOT_EMPTY_STRING ]`));

    this.wds = { host: "localhost" };

    console.log(chalk.bold.green(`[ WDS_CONFIG ][ wds.host ][ WAS_UPDATED_TO localhost ]`));
    console.log(chalk.green(JSON.stringify(this.config, null, 2)));

    return this.host;
  }

  public get port(): number {
    const { port } = this.wds;

    if (isNumber(port)) {
      return port;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ WARNING ][ wds.port ][ MUST_BE_A_NUMBER ]`));

    this.wds = { port: 3000 };

    console.log(chalk.bold.green(`[ WDS_CONFIG ][ wds.port ][ WAS_UPDATED_TO 3000 ]`));
    console.log(chalk.green(JSON.stringify(this.config, null, 2)));

    return this.port;
  }

  private get wds(): { [key: string]: any } {
    const { wds } = this.config;

    if (wds) {
      return wds;
    }

    console.log("");
    console.log(chalk.bold.yellow(`[ WDS_CONFIG ][ WARNING ][ wds ][ MUST_BE_DEFINED ]`));

    this.config = {
      wds: {
        host: "localhost",
        port: 3000,
      },
    };

    console.log(chalk.bold.green(`[ WDS_CONFIG ][ WAS_UPDATED ]`));
    console.log(chalk.green(JSON.stringify(this.config, null, 2)));

    return this.wds;
  }

  private set wds(params: { [key: string]: any }) {
    this.config = { wds: { ...this.wds, ...params } };
  }
}

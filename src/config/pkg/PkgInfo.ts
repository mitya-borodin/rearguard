import { isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { IPkgInfo } from "../../interfaces/IPkgInfo";
import { VersionableConfig } from "../VersionableConfig";

export class PkgInfo extends VersionableConfig implements IPkgInfo {
  public get name(): string {
    const { name } = this.pkg;

    if (isString(name) && name.length > 0) {
      return name;
    }

    console.log(chalk.bold.red(`[ PKG_INFO ][ ERROR ][ name ][ MUST_BE_A_NON_EMPTY_STRING ]`));
    console.log(chalk.bold.red(JSON.stringify(this.pkg, null, 2)));

    process.exit(1);

    return "";
  }

  public get engines(): { [key: string]: any } {
    const { engines } = this.pkg;

    if (!isObject(engines) || (isObject(engines) && Object.keys(engines).length === 0)) {
      this.pkg = {
        engines: {
          node: ">=10",
          npm: ">=6",
        },
      };
    }

    return this.engines;
  }

  public get nodeVersion(): number {
    return parseFloat(this.pkg.engines.node.match(/(\d+\.?)+/)[0]);
  }

  public get dependencies(): { [key: string]: string } {
    const { dependencies } = this.pkg;

    if (dependencies) {
      return dependencies;
    }

    this.pkg = { dependencies: {} };

    return this.dependencies;
  }
}

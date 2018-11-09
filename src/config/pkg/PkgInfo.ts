import { isObject, isString } from "@borodindmitriy/utils";
import chalk from "chalk";
import { VersionableConfig } from "../VersionableConfig";

export class PkgInfo extends VersionableConfig {
  public get name(): string {
    if (isString(this.pkg.name)) {
      return this.pkg.name;
    }

    console.log(chalk.bold.red(`[ PKG_INFO ][ ERROR ][ name ][ MUST_BE_A_STRING ]`));
    console.log(chalk.bold.red(JSON.stringify(this.pkg, null, 2)));

    process.exit(1);

    return "";
  }

  public get engines(): { [key: string]: any } {
    if (!isObject(this.pkg.engines)) {
      this.pkg = {
        engines: {
          node: ">=10",
          npm: ">=6",
        },
      };
    }

    return this.pkg.engines;
  }

  public get nodeVersion(): number {
    return parseFloat(this.pkg.engines.node.match(/(\d+\.?)+/)[0]);
  }

  public get dependencies(): { [key: string]: string } {
    const deps = this.pkg.dependencies;

    if (deps) {
      return deps;
    }

    this.pkg = { dependencies: {} };

    return {};
  }
}

import { isNumber } from "@borodindmitriy/utils";
import chalk from "chalk";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class AnalyzeConfig extends NonVersionableConfig {
  get port(): number {
    const { analyze } = this.config;

    if (analyze) {
      const { port } = analyze;

      if (isNumber(port) && port > 5000) {
        return port;
      } else {
        console.log("");
        console.log(chalk.bold.yellow(`[ ANALYZE_CONFIG ][ WARNING ][ port ][ MUST_BE_A_NUMBER AND MORE THEN 5000 ]`));
      }
    } else {
      console.log("");
      console.log(chalk.bold.yellow(`[ ANALYZE_CONFIG ][ WARNING ][ analyze ][ MUST_BE_DEFINED ]`));
    }

    this.config = { analyze: 10000 };

    console.log("");
    console.log(chalk.bold.green(`[ ANALYZE_CONFIG ][ UPDATE ][ port ][ WAS_UPDATED_TO 10000 ]`));
    console.log(chalk.green(JSON.stringify(this.config, null, 2)));

    return this.port;
  }
}

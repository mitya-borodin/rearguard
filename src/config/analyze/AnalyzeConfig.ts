import { isNumber } from "@borodindmitriy/utils";
import chalk from "chalk";
import { IAnalyzeConfig } from "../../interfaces/config/IAnalyzeConfig";
import { NonVersionableConfig } from "../NonVersionableConfig";

export class AnalyzeConfig extends NonVersionableConfig implements IAnalyzeConfig {
  get port(): number {
    const { analyze } = this.config;

    if (analyze) {
      const { port } = analyze;

      if (isNumber(port) && port > 5000) {
        return port;
      } else {
        console.log("");
        console.log(chalk.bold.yellow(`[ ANALYZE_CONFIG ][ WARNING ][ PORT ][ MUST_BE_A_NUMBER AND MORE THEN 5000 ]`));
      }
    } else {
      console.log("");
      console.log(chalk.bold.yellow(`[ ANALYZE_CONFIG ][ WARNING ][ ANALYZE ][ MUST_BE_DEFINED ]`));
    }

    this.config = { analyze: 10000 };

    console.log("");
    console.log(chalk.bold.green(`[ ANALYZE_CONFIG ][ ASSIGN ][ PORT ][ TO 10000 ]`));

    return this.port;
  }
}

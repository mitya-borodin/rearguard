import chalk from "chalk";
import { IRearguardConfig } from "../interfaces/config/IRearguardConfig";

export function show_docker_commands(rearguardConfig: IRearguardConfig) {
  const { pkg } = rearguardConfig;

  console.log(chalk.bold.magenta(`========================================`));
  console.log("");
  console.log(chalk.bold.magenta(`[ COMMANDS FOR DEPLOYING DOCKER ]`));
  console.log("");

  console.log(chalk.bold.magenta(`[ BUILD IMAGE ]`));
  console.log(chalk.bold.cyan(`docker build --no-cache -f ./build/Dockerfile -t example/${pkg.name}:${pkg.version} .`));
  console.log("");

  console.log(chalk.bold.magenta(`[ PUSH IMAGE ]`));
  console.log(chalk.bold.cyan(`docker push example/${pkg.name}:${pkg.version}`));
  console.log("");

  console.log(chalk.bold.magenta(`[ DOCKER-COMPOSE.YML EXAMPLE ]`));
  console.log(chalk.bold.cyan(`cat ./examples/docker-compose.yml`));
  console.log("");

  console.log(chalk.bold.magenta(`========================================`));
  console.log("");
}

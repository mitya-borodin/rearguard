import chalk from "chalk";
import { RearguardConfig } from "../../configs/RearguardConfig";

export const showDockerCommands = async (CWD: string): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);

  const name = rearguardConfig.getName();
  const version = rearguardConfig.getVersion();
  const dockerOrgNamespace = rearguardConfig.getRearguard().distribution.docker.org_namespace;

  console.log(chalk.bold.magenta(`========================================`));
  console.log("");
  console.log(chalk.bold.magenta(`[ COMMANDS FOR DEPLOYING DOCKER ]`));
  console.log("");

  console.log(chalk.bold.magenta(`[ BUILD IMAGE ]`));
  console.log(
    chalk.bold.cyan(
      `docker build --no-cache -f ./build/Dockerfile -t ${dockerOrgNamespace}/${name}:${version} .`,
    ),
  );
  console.log("");

  console.log(chalk.bold.magenta(`[ PUSH IMAGE ]`));
  console.log(chalk.bold.cyan(`docker push ${dockerOrgNamespace}/${name}:${version}`));
  console.log("");

  console.log(chalk.bold.magenta(`[ DOCKER-COMPOSE.YML EXAMPLE ]`));
  console.log(chalk.bold.cyan(`cat ./examples/docker-compose.yml`));
  console.log("");

  console.log(chalk.bold.magenta(`========================================`));
  console.log("");
};

import { isNumber } from "@borodindmitriy/utils";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../helpers/dependencyPaths";

// ! Returns the map of dependencies where keys is dependency name, value is weight.
// ! Weight is amount of dependencies.
export const getMapOfDependencies = async (
  CWD: string,
  mapOfDependencies: Map<string, number> = new Map(),
  target = "",
): Promise<Map<string, number>> => {
  // * Prepare data
  const rearguardConfig = new RearguardConfig(CWD);
  const dependencies = await rearguardConfig.getDependenciesCreatedWithRearguard();
  const globalNodeModulePath = await getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  for (const dependency of dependencies) {
    const globalDependencyCWD = path.resolve(globalNodeModulePath, dependency);
    const localDependencyCWD = path.resolve(localNodeModulePath, dependency);

    if (fs.existsSync(globalDependencyCWD)) {
      const globalRearguardConfig = new RearguardConfig(globalDependencyCWD);
      const globalDependencies = await globalRearguardConfig.getDependenciesCreatedWithRearguard();

      if (!mapOfDependencies.has(dependency)) {
        mapOfDependencies.set(dependency, globalDependencies.size);
      }

      const targetWeight = mapOfDependencies.get(target);

      if (isNumber(targetWeight)) {
        mapOfDependencies.set(target, targetWeight + globalDependencies.size);
      }

      await getMapOfDependencies(
        globalDependencyCWD,
        mapOfDependencies,
        target === "" ? dependency : target,
      );
      continue;
    }

    if (fs.existsSync(localDependencyCWD)) {
      const localRearguardConfig = new RearguardConfig(localDependencyCWD);
      const localDependencies = await localRearguardConfig.getDependenciesCreatedWithRearguard();

      if (!mapOfDependencies.has(dependency)) {
        mapOfDependencies.set(dependency, localDependencies.size);
      }

      const targetWeight = mapOfDependencies.get(target);

      if (isNumber(targetWeight)) {
        mapOfDependencies.set(target, targetWeight + localDependencies.size);
      }

      await getMapOfDependencies(
        localDependencyCWD,
        mapOfDependencies,
        target === "" ? dependency : target,
      );
      continue;
    }

    console.log(
      chalk.bold.red(
        `[ FLAT_LIST_OF_DEPENDENCIES ][ You haven't link in global node_modules ${globalDependencyCWD}; ]`,
      ),
    );

    console.log(
      chalk.bold.red(
        `[ FLAT_LIST_OF_DEPENDENCIES ][ You haven't local node_modules ${localDependencyCWD} ]`,
      ),
    );

    process.exit(1);
  }

  return mapOfDependencies;
};

import { isNumber } from "@borodindmitriy/utils";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { getGlobalNodeModulePath, getLocalNodeModulePath } from "../../helpers/dependencyPaths";
import { promisify } from "util";

const exists = promisify(fs.exists);
const readdir = promisify(fs.readdir);

const getMonoDependencyCWD = async (
  monoDependencyDirs: string[],
  dependency: string,
): Promise<string | void> => {
  for (const monoDependencyDir of monoDependencyDirs) {
    const pathToMonoDependency = path.resolve(process.cwd(), monoDependencyDir);
    const dependencyDirs = (await readdir(pathToMonoDependency)).map((dirName) =>
      path.resolve(pathToMonoDependency, dirName),
    );

    for (const dependencyCWD of dependencyDirs) {
      const rearguardConfig = new RearguardConfig(dependencyCWD);

      if (dependency === rearguardConfig.getName()) {
        return dependencyCWD;
      }
    }
  }
};

// ! Returns the map of dependencies where keys is dependency name, value is weight.
// ! Weight is amount of dependencies.
export const getMapOfDependencies = async (
  CWD: string,
  monoDependencyDirs: string[],
  mapOfDependencies: Map<string, number> = new Map(),
  target = "",
  searchInMonoDirectory = false,
): Promise<Map<string, number>> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const dependencies = await rearguardConfig.getDependenciesCreatedWithRearguard(
    monoDependencyDirs,
    searchInMonoDirectory,
  );
  const globalNodeModulePath = getGlobalNodeModulePath();
  const localNodeModulePath = getLocalNodeModulePath(CWD);

  for (const dependency of dependencies) {
    if (monoDependencyDirs.length > 0) {
      const monoDependencyCWD = await getMonoDependencyCWD(monoDependencyDirs, dependency);

      if (monoDependencyCWD && (await exists(monoDependencyCWD))) {
        const monoRearguardConfig = new RearguardConfig(monoDependencyCWD);
        const monoDependencies = await monoRearguardConfig.getDependenciesCreatedWithRearguard();

        if (!mapOfDependencies.has(dependency)) {
          mapOfDependencies.set(monoDependencyCWD, monoDependencies.size);
        }

        const targetWeight = mapOfDependencies.get(target);

        if (isNumber(targetWeight)) {
          mapOfDependencies.set(target, targetWeight + monoDependencies.size);
        }

        await getMapOfDependencies(
          monoDependencyCWD,
          monoDependencyDirs,
          mapOfDependencies,
          target === "" ? monoDependencyCWD : target,
          false,
        );
        continue;
      }

      continue;
    }

    const globalDependencyCWD = path.resolve(globalNodeModulePath, dependency);

    if (await exists(globalDependencyCWD)) {
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
        monoDependencyDirs,
        mapOfDependencies,
        target === "" ? dependency : target,
      );
      continue;
    }

    const localDependencyCWD = path.resolve(localNodeModulePath, dependency);

    if (await exists(localDependencyCWD)) {
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
        monoDependencyDirs,
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

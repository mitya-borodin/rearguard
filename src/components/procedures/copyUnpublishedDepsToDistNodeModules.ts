import chalk from "chalk";
import copy from "copy";
import path from "path";
import File from "vinyl";
import { RearguardConfig } from "../../configs/RearguardConfig";
import { DISTRIBUTIVE_DIR_NAME } from "../../const";
import { getLocalNodeModulePath } from "../../helpers/dependencyPaths";

export const copyUnpublishedDepsToDistNodeModules = async (CWD: string): Promise<void> => {
  const rearguardConfig = new RearguardConfig(CWD);
  const localNodeModulePath = getLocalNodeModulePath(CWD);
  const distDirPath = path.resolve(CWD, DISTRIBUTIVE_DIR_NAME);
  const unPublishedDependencies = rearguardConfig.getUnPublishedDependency();

  await Promise.all(
    unPublishedDependencies.map(async (unPublishedDependency) => {
      return new Promise((resolve, reject): void => {
        copy(
          `${path.resolve(localNodeModulePath, unPublishedDependency)}/**`,
          path.resolve(`${distDirPath}/node_modules/${unPublishedDependency}`),
          (error: Error | null, files?: File[]) => {
            if (!error) {
              if (files) {
                console.log(
                  chalk.cyan(
                    `[ COPY ][ NODE_MODULE ][ FILES ${files.length} ][ TO_DIST_NODE_MODULEs ]`,
                  ),
                );
              }

              resolve();
            } else {
              reject(error);
            }
          },
        );
      });
    }),
  );

  console.log("");
};

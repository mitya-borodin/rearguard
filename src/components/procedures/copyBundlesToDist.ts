import chalk from "chalk";
import copy from "copy";
import * as path from "path";
import { DISTRIBUTIVE_DIR_NAME, DLL_BUNDLE_DIR_NAME, LIB_BUNDLE_DIR_NAME } from "../../const";
import File from "vinyl";

export const copyBundlesToDist = async (CWD: string): Promise<void> => {
  await new Promise((resolve, reject): void => {
    copy(
      [`${path.resolve(CWD, DLL_BUNDLE_DIR_NAME)}/**`],
      path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
      (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files) {
            console.log(
              chalk.white(`[ COPY ][ DLL ][ BUNDLE ][ TO_DIST ][ ${files.length} FILES ]`),
            );
          }

          resolve();
        } else {
          reject(error);
        }
      },
    );
  });

  await new Promise((resolve, reject): void => {
    copy(
      [`${path.resolve(CWD, LIB_BUNDLE_DIR_NAME)}/**`],
      path.resolve(CWD, DISTRIBUTIVE_DIR_NAME),
      (error: Error | null, files?: File[]) => {
        if (!error) {
          if (files) {
            console.log(
              chalk.white(`[ COPY ][ LIB ][ BUNDLE ][ TO_DIST ][ ${files.length} FILES ]`),
            );
          }

          resolve();
        } else {
          reject(error);
        }
      },
    );
  });
};

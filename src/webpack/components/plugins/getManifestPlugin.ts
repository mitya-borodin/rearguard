import webpack from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";
import { RearguardConfig } from "../../../configs/RearguardConfig";

export const getManifestPlugin = (
  CWD: string,
  output: webpack.Output,
  isDevelopment: boolean,
): webpack.Plugin[] => {
  const rearguardConfig = new RearguardConfig(CWD);
  const isBrowser = rearguardConfig.isBrowser();
  const isApp = rearguardConfig.isApp();

  if (isBrowser && isApp) {
    return [
      // Generate an asset manifest file with the following content:
      // - "files" key: Mapping of all asset filenames to their corresponding
      //   output file so that tools can pick it up without having to parse
      //   `index.html`
      // - "entrypoints" key: Array of files which are included in `index.html`,
      //   can be used to reconstruct the HTML if necessary
      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: isDevelopment ? "/" : output.publicPath,
        generate: (seed, files, entrypoints): any => {
          const manifestFiles = files.reduce((manifest: any, file: any) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);

          const entrypointFiles: string[] = [];

          for (const key in entrypoints) {
            if (entrypoints.hasOwnProperty(key)) {
              entrypoints[key]
                .filter((fileName) => !fileName.endsWith(".map"))
                .forEach((fileName) => {
                  entrypointFiles.push(fileName);
                });
            }
          }

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
    ];
  }

  return [];
};

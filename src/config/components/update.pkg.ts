import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as prettier_package_json from "prettier-package-json";
import { context, entry, isDll, isLib, root } from "./target.config";

export async function update_pkg() {
  const pkgPath = path.resolve(root, "package.json");
  const isEntry = fs.existsSync(path.resolve(context, entry));

  if (fs.existsSync(pkgPath)) {
    let pkg = require(pkgPath);

    pkg.isDll = isDll && !isEntry;
    pkg.isLib = isLib;
    pkg.isProject = isEntry && !isLib;

    if (pkg.isDll) {
      pkg.files = ["dll_bundle"];
    }

    if (pkg.isLib) {
      pkg.files = ["lib", "lib_bundle"];
    }

    if (pkg.isProject) {
      pkg.files = ["dist"];
    }

    pkg = prettier_package_json.format(pkg, {
      keyOrder: [
        /**
         * Details
         */
        "private",
        "version",
        "name",
        "description",
        "license",
        "author",
        "maintainers",
        "contributors",
        "homepage",
        "repository",
        "bugs",

        /**
         * Yarn specific
         */
        "workspaces",

        /**
         * Configuration
         */
        "main",
        "module",
        "browser",
        "man",
        "preferGlobal",
        "bin",
        "files",
        "isProject",
        "isLib",
        "isDll",
        "directories",
        "scripts",
        "config",

        /**
         * Dependencies
         */
        "optionalDependencies",
        "dependencies",
        "bundleDependencies",
        "bundledDependencies",
        "peerDependencies",
        "devDependencies",

        /**
         * Used for npm search
         */
        "keywords",

        /**
         * Constraints
         */
        "engines",
        "engine-strict",
        "engineStrict",
        "os",
        "cpu",

        /**
         * Package publishing configuration
         */
        "publishConfig",
      ],
    });

    console.log(
      chalk.bold.cyanBright(`[ PACKAGE.JSON ][ UPDATED: ${pkgPath} ]`),
    );

    fs.writeFileSync(pkgPath, pkg);
  } else {
    console.log(
      chalk.bold.redBright(`[ PACKAGE.JSON ][ IS_NOT_EXIST: ${pkgPath} ]`),
    );
  }
}

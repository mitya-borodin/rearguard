import * as fs from "fs";
import { snakeCase } from "lodash";
import * as path from "path";
import { Ipkg } from "../../interfaces/IConfigs";

export default (): Ipkg => {
  const CWD = process.cwd();
  const pkgPath = path.resolve(CWD, "package.json");

  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    if (pkg.engines) {
      const nodeVersion = parseFloat(pkg.engines.node.match(/(\d+\.?)+/)[0]);
      const engines = pkg.engines;
      const dependencies = pkg.dependencies;
      const name = snakeCase(pkg.name);

      return {
        dependencies,
        engines,
        name,
        nodeVersion,
      };
    }
  }

  return {
    dependencies: {},
    engines: {},
    name: "name",
    nodeVersion: 0,
  };
};

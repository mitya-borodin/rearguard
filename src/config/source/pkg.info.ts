import * as fs from "fs";
import * as path from "path";
import {Ipkg} from "../../interfaces/IConfigs";

export default (): Ipkg => {
  const CWD = process.cwd();
  const pkgPath = path.resolve(CWD, "package.json");

  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    const nodeVersion = parseFloat(pkg.engines.node.match(/(\d+\.?)+/)[0]);
    const engines = pkg.engines;
    const dependencies = pkg.dependencies;

    return {
      dependencies,
      engines,
      nodeVersion,
    };
  }

  return {
    dependencies: {},
    engines: {},
    nodeVersion: 0,
  };
};

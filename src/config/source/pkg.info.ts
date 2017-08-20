import * as fs from 'fs';
import * as path from 'path';
import { Ipkg } from '../../interfaces/IConfigs';

export default (): Ipkg => {
  const CWD = process.cwd();
  const pkgPath = path.resolve(CWD, 'package.json');
  
  if (fs.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    const nodeVersion = parseFloat(pkg.engines.node.match(/(\d+\.?)+/)[0]);
    const engines = pkg.engines;
    const dependencies = pkg.dependencies;
    
    return {
      nodeVersion,
      engines,
      dependencies,
    };
  }
  
  return {
    nodeVersion: 0,
    engines: {},
    dependencies: {}
  };
}

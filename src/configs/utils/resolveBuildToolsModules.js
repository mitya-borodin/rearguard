import path from 'path';

const buildToolsNodeModules = process.env.BUILD_TOOLS_NODE_MODULE;

export default function resolveBuildToolsModules(packageName = '') {
  return path.resolve(buildToolsNodeModules, packageName);
}

import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import {
  context,
  getProjectAbsPath,
  isInferno,
  isTS,
  tmpTypescryptConfigDir,
  tmpTypescryptConfigPath,
  typescript,
} from './prepare.build-tools.config';

export default () => {
  if (isTS) {
    const {configPath, showConfigForIDE, config: {compilerOptions, compileOnSave}} = typescript;
    const {dependencies: {typescript: version}} = require(path.resolve(__dirname, '../../package.json'));
    const config = {
      version,
      compilerOptions: Object.assign({
        target: 'es6',
        module: 'es6',
        allowJs: false,
        allowSyntheticDefaultImports: true,
        preserveConstEnums: true,
        sourceMap: true,
        moduleResolution: 'node',
        lib: [
          'es6',
          'es7',
          'dom',
        ],
        ...isInferno ? {
          types: [
            'inferno',
          ],
          jsx: 'preserve',
        } : {
          jsx: 'react',
        },
        noUnusedLocals: true,
        strictNullChecks: true,
        removeComments: false,
      }, compilerOptions),
      include: [
        `${context}/**/*`,
      ],
      exclude: [
        'node_modules',
      ],
      compileOnSave,
    };

    if (showConfigForIDE) {
      fs.writeFileSync(getProjectAbsPath(configPath), JSON.stringify(config, null, 2));
    } else {
      fs.unlinkSync(getProjectAbsPath(configPath));
    }
    mkdirp.sync(tmpTypescryptConfigDir);
    fs.writeFileSync(tmpTypescryptConfigPath, JSON.stringify(config, null, 2));
  }
}

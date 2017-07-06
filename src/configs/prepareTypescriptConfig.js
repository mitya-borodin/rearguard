import fs from 'fs';
import path from 'path';
import { context, getProjectAbsPath, isTS, typescript, tmpTypescryptConfigPath } from './prepare.build-tools.config';

export default () => {
  if (isTS) {
    const {configPath, showConfigForIDE, config: {compilerOptions, compileOnSave}} = typescript;
    const {dependencies:{typescript:version}} = require(path.resolve(__dirname, '../../package.json'));
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
        types: [
          'inferno',
        ],
        jsx: 'preserve',
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

    fs.writeFileSync(tmpTypescryptConfigPath, JSON.stringify(config, null, 2));
  }
}

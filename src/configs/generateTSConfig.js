import fs from 'fs';
import path from 'path';
import { context } from './prepare.build-tools.config';

export default () => {
  const config = {
    version: '2.4.1',
    compilerOptions: {
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
    },
    include: [
      `${context}/**/*`,
    ],
    exclude: [
      'node_modules',
    ],
    compileOnSave: false,
  };

  fs.writeFileSync(path.resolve(__dirname, '../../tmp/tsconfig.json'), JSON.stringify(config, null, 2));
}

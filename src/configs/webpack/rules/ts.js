import { context } from '../../prepare.build-tools.config';

export default ({test = /\.(ts|tsx)?$/, exclude = [/node_modules/]}) => ([
  {
    test,
    loader: 'awesome-typescript-loader',
    exclude,
    include: [context],
    options: {
      configFileName: '',
      compilerOptions: {
        'version': '2.4.1',
        'compilerOptions': {
          'target': 'es6',
          'module': 'es6',
          'allowJs': false,
          'allowSyntheticDefaultImports': true,
          'preserveConstEnums': true,
          'sourceMap': true,
          'moduleResolution': 'node',
          'lib': [
            'es6',
            'es7',
            'dom',
          ],
          'types': [
            'inferno',
          ],
          'jsx': 'preserve',
          'noUnusedLocals': true,
          'strictNullChecks': true,
          'removeComments': false,
        },
        'include': [
          `${context}/**/*`,
        ],
        'exclude': [
          'node_modules',
        ],
        'compileOnSave': false,
      },
    },
  },
  {
    enforce: 'pre',
    test: /\.(js|jsx)?$/,
    loader: 'source-map-loader',
    exclude,
    include: [context],
  },
])

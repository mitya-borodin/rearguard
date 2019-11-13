# Rearguard

- [What is it rearguard ?](#whatIsIt)
- [Technology](#tech)
- [Install](#install)
- [CLI](#cli)

<a name="whatIsIt"></a>

## What is it rearguard

Rearguard is a toolset for WEB and Node developers that help with every routine action and setting.

- First of all, rearguard covers basic needs:

  - development
  - code verification by static analyzers (ESLint, Prettier)
  - testing (Jest)
  - assembly result (application, library, isomorphic library)

- Second, the rearguard knows a lot about the project and can automatically manage VSCode configurations since VSCode settings are JSON files.
- In the third case, the rearguard contains templates for the main project settings such as (`.eslint.json, .eslintignore, .gitignore, Dockerfile, .dockerignore, nginx.conf, .prettierrc, .prettierignore`). The rearguard adds these templates to the project and then uses them as settings for Webpack and other users, thus managing configurations such as `.eslint.json`. The rearguard allows you to overwrite the settings if necessary to update them with the help of the `rearguard refresh --force` command.
- The rearguard supports two schemes of code organization known as a mono repository and poly repository.
- The rearguard also covers a large number of household moments, which eliminates the need to take care of these moments.

The rearguard as a caring parent :-)

<a name="tech"></a>

## Technology

- Typescript
  - ts-loader
  - eslint with eslint-loader
  - ts-loader with ForkTsCheckerWebpackPlugin **no yet implemented**
- React (TSX)
- CSS
  - SCSS support
  - isomorphic-style-loader ( _optional_ )
  - CSS-Modules for ( css and scss )
  - PostCSS
    - [postcss-import](https://github.com/postcss/postcss-import)
    - [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables)
    - [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
    - [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
      - [features](https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js):
        - case-insensitive-attributes: `true`
        - all-property: `{ reset: "inherited" }`
        - color-functional-notation: `true`
        - custom-media-queries: `true`
        - media-query-ranges: `true`
        - nesting-rules: `true`
        - custom-properties: `true`
      - autoprefixer: `{ flexbox: "no-2009", overrideBrowserslist: browserslist }`
      - stage: `3`
      - browsers: `browserslist`
    - [postcss-normalize](https://github.com/csstools/postcss-normalize)
    - possibility to connect third-party postcss plugins via `postcss.config.js`
  - browserslist settings from `package.json`
  - stylelint **no yet implemented**
- Webpack
- WebpackDevServer
- DllPlugin and DllReferencePlugin are applied
- HotModuleReplacementPlugin, CaseSensitivePathsPlugin are applied
- Enabled chunk optimization
- All moment library locales are skipped
- Mono and poly repositories support
- BundleAnalyzer supported
- The eslint with access to configuration from the project (rearguard use .eslint.json for eslint-loader)
- The stylelint with access to configuration from the project (rearguard use .stylelintrc.json for stylelint-loader) **no yet implemented**
- Supported testing environment (Jest, Karma), with access to configuration from the project **no yet implemented**
- Workbox included **no yet implemented**

<a name="cli"></a>

## CLI

### Project Initialization / Refresh

- rearguard init browser app [ --force ]
- rearguard init browser dll [ --force ]
- rearguard init browser lib [ --force ]
- rearguard init isomorphic [ --force ]
- rearguard init node lib [ --force ]
- rearguard init node app [ --force ]
- rearguard refresh [ --force ] **no yet implemented**

### Develop mode

- rearguard start [ --release | --debug | --ts_node_dev ]

### Build mode

- rearguard build [ --only_dev | --debug ]

### Testing mode

- rearguard test [ --debug ]

### Validating

- rearguard lint [ --fix ]

### Group service

- rearguard group bootstrap [ --only_dev | --debug ]
- rearguard group clear
- rearguard group install
- rearguard group link
- rearguard group build [ --only_dev | --debug ]
- rearguard group lint
- rearguard group lint-fix
- rearguard group typecheck
- rearguard group validate-prettiness
- rearguard group validate
- rearguard group make-prettier
- rearguard group test [ --debug ] **no yet implemented**
- rearguard group publish [ --patch | --minor | --major ] **no yet implemented**
- rearguard group refresh [ --force ] **no yet implemented**

<a name="install"></a>

## Install

Globally, for use in multiple projects.

```sh
npm install -g rearguard
```

Locally, in the project for saves the exact version.

```sh
npm install -D rearguard
```

## Documentation / Документация

- [English](./docs/en/index.md)
- [Русский](./docs/ru/index.md)

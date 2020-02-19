# Rearguard

[wwwww](https://www.codewars.com/users/mitya-borodin/badges/large)

- [Rearguard](#rearguard)
  - [Getting Started](#getting-started)
  - [What is it rearguard](#what-is-it-rearguard)
  - [Technology](#technology)
  - [CLI](#cli)
    - [Project Initialization / Refresh](#project-initialization--refresh)
    - [Develop mode](#develop-mode)
    - [Build mode](#build-mode)
    - [Testing mode](#testing-mode)
    - [Validating](#validating)
    - [Group service](#group-service)
  - [Install](#install)
  - [Examples](#examples)
  - [Documentation / Документация](#documentation--%d0%94%d0%be%d0%ba%d1%83%d0%bc%d0%b5%d0%bd%d1%82%d0%b0%d1%86%d0%b8%d1%8f)

<a name="gettingStarted"></a>

## Getting Started

```sh
  npm i -g rearguard
  mkdir my-new-app
  cd my-new-app
  rearguard init browser app
  npm start
```

- You will get a ready-made project for developing a browser application with an `index.tsx` entry point.
- Then you can add your code to the index.tsx.
- After you install the dependencies, you can list them in vendors.ts, this will allow rearguard to create a dll bundle.

```typescript
import "react";
import "react-dom";
import "mobx";
```

For create DLL bundle you should run `npm run build`, after that you will have DLL bundle and you can run `npm start`.

- The dll bundle is necessary in order to exclude rarely changing pieces of code from the Assembly process, thus saving time

<a name="whatIsIt"></a>

## What is it rearguard

Rearguard is a set of tools for developing client-server applications in which the code base is developed in a mono repository. This doesn't exclude the possibility of working in a familiar way, using separate repositories for the client, server and other libraries. But the way of code organization in the **mono repository** is considered to be the **recommended** one.

Rearguard supports the following types of projects: browser (dll, lib, app), node (lib, app), isomorphic (lib, app).

- First of all, rearguard covers basic needs:

  - development
  - code verification by static analyzers (ESLint, Prettier)
  - testing (Jest)
  - assembly result (application, library, isomorphic library)

- Second, the rearguard knows a lot about the project and can automatically manage VSCode configurations since VSCode settings are JSON files.
- In the third case, the rearguard contains templates for the main project settings such as (`.eslint.json, .eslintignore, .gitignore, Dockerfile, .dockerignore, nginx.conf, .prettierrc, .prettierignore`). The rearguard adds these templates to the project and then uses them as settings for Webpack and other users, thus managing configurations such as `.eslint.json`. The rearguard allows you to overwrite the settings. If necessary, you can bring the settings to the current default settings, if the rearguard has been updated `rearguard refresh --force`.
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
  - stylelint
- Webpack
- WebpackDevServer
- DllPlugin and DllReferencePlugin are applied
- HotModuleReplacementPlugin, CaseSensitivePathsPlugin are applied
- Enabled chunk optimization
- All moment library locales are skipped
- Mono and poly repositories support
- BundleAnalyzer supported
- The eslint with access to configuration from the project (rearguard use .eslint.json for eslint-loader)
- The stylelint with access to configuration from the project (rearguard use .stylelintrc.json for stylelint-loader)
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
- rearguard refresh [ --force ]
- rearguard sync

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
- rearguard group link
- rearguard group start [ --release | --debug | --ts_node_dev ]
- rearguard group build [ --only_dev | --debug ]
- rearguard group lint
- rearguard group lint-fix
- rearguard group typecheck
- rearguard group validate-prettiness
- rearguard group validate
- rearguard group make-prettier
- rearguard group test [ --debug ] **no yet implemented**
- rearguard group publish [ --patch | --minor | --major ] **no yet implemented**
- rearguard group refresh [ --force ]
- rearguard group sync

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

<a name="examples"></a>

## Examples

You can see an example of how to use it in the following projects:

**!!! They're not perfect at the moment, but I'll upgrade them to a canonical look as much as I can.**

- [base-code](https://github.com/mitya-borodin/base-code)
- [example](https://github.com/mitya-borodin/example)
- [home-tracker](https://github.com/mitya-borodin/home-tracker)

<a name="docs"></a>

## Documentation / Документация

- [English](./docs/en/index.md)
- [Русский](./docs/ru/index.md)

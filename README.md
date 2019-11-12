# Rearguard

- [What is it rearguard ?](#whatIsIt)
- [Technology](#tech)
- [Install](#install)
- [CLI](#cli)

<a name="whatIsIt"></a>

## What is it rearguard

<a name="tech"></a>

### Technology

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

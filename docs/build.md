# rearguard build

Assembly - the main task of this system. Turns source code into files for use by other libraries, as well as for deployment.

## General startup options

- --release | -r - sets the settings for the build in `production` mode.
- --debug | -d - displays all possible information about the dependency graph, which is available for the webpack, and also launches the WEB interface in which you can learn about the contents of the bundle.
- --both - in a single process, collects both `development` and`production`.

## Build browser library

```bash
rearguard build --browser_lib [ --dll | --load_on_demand | --both | --release | -r | --debug | -d ]
```

The result of the build will be lib_bundle and optionally dll_bundle, as well as the lib directory with .d.ts files that describe what is exported from the library.

This package can be used only in browser applications.

## Build node library

```bash
rearguard build --node_lib [ --both | --release | -r | --debug | -d ]
```

The result of the build will be the lib directory containing the .d.ts and .js files.

This package can be used only in node.js applications.

## Build isomorphic library

```bash
rearguard build --browser_lib --node_lib [ --dll | --load_on_demand | --both | --release | -r | --debug | -d ]
```

The result of the build will be the lib_bindle, lib, and optionally dll_bundle directories. The lib directory will contain .js, .d.ts files. Building an isomorphic library does not make the code itself isomorphic, in order for the code to be used on both platforms, it is necessary to implement it taking into account both platforms.

## Assembly application

```bash
rearguard build --application [ --dll | --both | --release | -r | --debug | -d ]
```

The result of the build is `index.html`,`main.js`, the dependencies copied to the same level as `index.html`. The directory in which the files are laid out is `dist`.

The result of the assembly can only be used for deployment on a WEB server.

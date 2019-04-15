# rearguard init

Initialization is the process of adding all the necessary files and fields to package.json.

## List of generated files

- [**tslint.json**](https://palantir.github.io/tslint/usage/configuration/)
- [**tsconfig.json**](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [**.prettierrc**](https://prettier.io/docs/en/configuration.html)
- **rearguard.json** - non-versioned configuration file used for proxy configuration, webpac-dev-server socket, port for output of build analytics.
- [**.dockerignore**](https://docs.docker.com/engine/reference/builder/)
- [**.editorconfig**](https://editorconfig.org)
- [**.gitignore**](https://git-scm.com/docs/gitignore)
- [**.npmrc**](https://docs.npmjs.com/files/npmrc)
- **postcss.config.js** - plugins connection file for postCSS.
- **pre_publish.sh** - script to check the package before publishing.
- **src/typings.d.ts** - typescript declarations for importing non-TS modules into webpack concepts; This is necessary in order not to generate .d.ts files for importing css, png, and other file formats.
- **src/index.tsx** - entry point to the project, is used to develop / build the final result.
- **src/lib_exports.ts** - API export point.
- **src/vendors.ts** - entry point for compiling an API.

## List of fields in package.json

- [**main**](https://docs.npmjs.com/files/package.json#main)
- [**types**](http://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [**module**](https://docs.npmjs.com/files/package.json#main)
- [**files**](https://docs.npmjs.com/files/package.json#files)
- [**scripts**](https://docs.npmjs.com/files/package.json#scripts)
- [**rearguard**](https://gitlab.com/mitya-borodin/rearguard#версионируемые)

## Launch parameters

Startup options can be combined. Running rearguard init will display information about what launch options there are.

- --dll - includes build dll_bundle;
- --browser_lib - includes building lib_bundle and generating .d.ts files in the lib directory;
- --load_on_demand - marks the package as loadable on demand, so this dependency will not appear in the index.html of the resulting project;
- --node_lib - enables generation of .js and .d.ts in the lib directory;
- --application - marks the project as resulting, such a project generates a dist directory where all the connected dependencies will be located.
- --back_end - marks the project as a back-end, it is possible to build such a project as a server application and deploy it in production.

## Launch combinations

### Package of common dependencies

```bash
rearguard init --dll
```

A project will be initialized with only `src/${dll_entry}`.
As a result, dll_bundle will be built in dev and prod mode.

### Package with browser library

```bash
rearguard init --browser_lib [ --dll | --load_on_demand ]
```

A project will be initialized which has two entry points `src/${entry}` and `src/${lib_entry}`. The first entry point is required to run the code in the browser, the second entry point is required to export from the library.

**Optionally** can have its own dll_bundle, with dependencies unique only for this package. If the --dll flag is specified, then the `src/${dll_entry}` entry point appears.

The output will have lib_bundle with the appropriate bundle, lib with .d.ts files.

If a DLL is added, it will also have a dll_bundle directory with the corresponding bundle.

### Package with node library

```bash
rearguard init --node_lib
```

A project that has one entry point `src/${lib_entry}` will be initialized. Which is necessary for export from the library. Library development can be carried out in three styles:

1. "In the blind" - relying only on the typescrypt compilation and not running the code with each change;
2. Development with testing - the implementation starts immediately during the execution of tests;
3. As part of a target project or other dependency - a situation when a package is developed in conjunction with a target project and linked via npm link on the developer’s machine;

The output will have a lib directory with .js and .d.ts files.

### Package with isomorphic library

```bash
rearguard init --browser_lib --node_lib [ --dll | --load_on_demand ]
```

Combines browser library and node library, can have own dll_bundle.

At the output, it generates the lib_bundle and lib directories, as well as an optional dll_bundle. The lib directory contains .js and .d.ts files. The lib_bundle and dll_bundle directories contain bundle files.

### Resulting project

The resulting project is the result that deploying on the server. It has index.html and next to all dependencies. This entire directory with index.html and the main code and dependencies is uploaded to the WEB server that sends these files to browsers.

```bash
rearguard init --application [ --dll ]
```

The project has a main entry point that is `src/${entry}`, and optionally an entry point for assembling the `src/${dll_entry}` DLL.

At the output, it generates the `dist` directory in which index.html, main.js, all connected dependencies (dll_bunele, lib_bundle) are located.
Those dependencies that **NOT** are marked with the `--load_on_demand` flag will be present in index.html, and those **NOTES marked** will be recorded in`src/deferred_module_list.ts`, and at runtime can be loaded into the browser and executed.

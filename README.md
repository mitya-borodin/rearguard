# Rearguard

- [What is it rearguard ?](#whatIsIt)
- [Examples](#examples)
- [Technology](#tech)
- [Settings](#settings)
- [Install](#install)
- [CLI](#cli)
- [Project structure](#structure)
- [Modules work example](#modules)
- [CSS work example](#css)

<a name="whatIsIt"></a>

## What is it rearguard

Rearguard - This is a one-page application build and development environment.
Mobile and desktop applications (based on the Cordova project), sites.
Tool supports [**library oriented design**](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/library_oriented_design.md) development,
is also involved as a tool in [Software development methodology](https://gitlab.com/mitya-borodin/software-development-methodology).

A development method known as a mono-repository is supported.

Monolithic way of development is not excluded and is a special case.

<a name="examples"></a>

## Examples

- [@borodindmitriy/vendors](https://www.npmjs.com/package/@borodindmitriy/vendors)
- [@borodindmitriy/interfaces](https://www.npmjs.com/package/@borodindmitriy/interfaces)
- [@borodindmitriy/utils](https://www.npmjs.com/package/@borodindmitriy/utils)
- [@borodindmitriy/isomorphic](https://www.npmjs.com/package/@borodindmitriy/isomorphic)
- [@borodindmitriy/deferred_module_test](https://www.npmjs.com/package/@borodindmitriy/deferred_module_test)
- [@borodindmitriy/front-end-lib](https://www.npmjs.com/package/@borodindmitriy/front-end-lib)
- [@borodindmitriy/back-end-lib](https://www.npmjs.com/package/@borodindmitriy/back-end-lib)
- [home-tracker](https://gitlab.com/home-tracker) - The project is implementing an application for interaction between apartment owners and the management company. **rearguard** and **successful software design** are used for implementation.

<a name="tech"></a>

### Technology

- OOP
- SOLID
- Design patterns
- Browser
- HTML
- CSS
- React.js
- JSS
- CSS-Modules
- Mobx
- Node.js
- MongoDB
- Express
- Cordova

This list of technologies is used to create single-page sites.
Mobile and desktop applications based on the Cordova project.

<a name="settings"></a>

## Settings

### Versioned

All versioned settings are in the rearguard field: {/_ settings fields _/}, inside package.json.

- **context: string** - context directory, relative to the current working directory.
- **entry: string** - entry point to the project, used for assembly (project) and / or development (project, library). The project entry point has no API exports.
- **dll_entry: string** - entry point for the DLL, as a result, dll_bindle and manifest.json will be compiled.
- **lib_entry: string** - library API exit point, as a result, lib_bundle will be built to connect to the browser and compile the corresponding directories to the lib directory to use the d.ts files in the IDE and js files in the node.js environment.
- **modules: string[]** - a list of directories within the context that can be considered modules. Allows you to write not relative and not absolute paths. But if you create a library then you need to use absolute paths.
- **output: { path: string; publicPath: string }** - specify the directory in which to dump the result of the project assembly, as well as the public path to access files from the browser.
- **post_css_plugins_path: string** - points to a file with module.exports = [/* connected plugins for post_css */], relative to the current working directory.
- **sync_project_deps: string[]** - list of module names to be connected to the project. In particular, what dll_bundle and lib_bundle need to be connected to the browser. Also, each of the specified modules is searched in the global node_modules and is copied to the local one when the module is changed by a link. This setting allows you to build and develop the current project or library, as well as the development of the dependent module.
- **has_dll: boolean** - says that there is a dll_bundle in the current project;
- **has_node_lib: boolean** - says that the current project is compiling a version for use in the node.js environment;
- **has_browser_lib: boolean** - says that the current project has lib_bundle that will be used in the browser environment;
- **is_application: boolean** - says that the current project can be used as an independent. Make the assembly from the entry and upload to the server.
- **is_back_end: boolean** - says that the current project is a back-end application and not a library, and works as an independent process.
- **publish_in_git: boolean** - says that the project is published only in git, it is not necessary to publish it in the npm registry.
- **docker_org_name: string** - organization name in the docker registry.

### Non-versioned

All non-versioned settings are in the rearguard.json file.

- **analyze: { port: 10000 (default value) }** - A port is declared for the bundle analysis tool.
- **status: "init"(default value)** - the project build status is “init”, “in_progress”, “done”. Listening to this setting, you can understand at what stage is the assembly of the project.
- **wds: { host: string, port: string, proxy: { [key: string]: any } }** - settings for webpack-dev-server.

### Meta

All meta files are automatically generated. Changes to these files only through pull request;

- **monorepo.json** - contains { modules: string }, points to the directory in which the modules are located.
- **.prettierrc** - contains settings for prettier.io.
- **tslint.json** - contains settings for tsLint.
- **tsconfig.json** - contains settings for typescript.
- **.npmrc** - contains settings for npm.
- **pre_publish.sh** - contains a set of actions to check the package before publishing.
- **typings.d.ts** - contains a type declaration for modules with extensions other than ts.
- **.dockerignore** - contains information about which directories and files to remove from the context of the docker.
- **.editorconfig** - defines tab settings for IDE.
- **.gitignore** - indicates which files and directories are not versioned.
- **postcss.config.js** - The file in which plug-ins for post_css are connected.

<a name="install"></a>

## Install

The package can be installed both locally and globally. It depends on your preference. Installation saves globally
disk space, but you will have one version for all projects, which is generally not bad. But the local installation also has
Pros: it will allow you to use a specific version for the project.

Globally, for use in multiple projects.

```sh
npm install -g rearguard
```

Locally, in the project and saving the exact version.

```sh
npm install -D rearguard
```

<a name="cli"></a>

## CLI

- [**rearguard init** [ --dll | --browser_lib | --load_on_demand | --node_lib | --application | --back_end ]](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/init.md)
- [**rearguard build** [ --application | --dll | --browser_lib | --node_lib | --release | -r | --both | --debug | -d ]](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/build.md)
- [**rearguard monorepo** [ --init | --install | --build | --link | --bootstrap | --release | -r | --both | --test | --publish | --patch | --minor | --major ]](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/monorepo.md)
- [**rearguard wds** [ --release | -r | --debug | -d ]](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/wds.md)
- [**rearguard sync** [ --watch ]](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/sync.md)
- [**rearguard start_node_server**](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/start_node_server.md)
- [**rearguard build_node_server**](https://gitlab.com/mitya-borodin/rearguard/blob/master/docs/build_node_server.md)
- **rearguard test** - run `*.spec.ts` files into `tests` directory;

<a name="structure"></a>

## Project structure

- **implementation** - Catalog containing implementations of system objects.
- **interfaces** - Catalog containing interfaces of system objects.
- adapter - Catalog of adapters.
- aggregate - Catalog of aggregates.
- filter - Catalog of filters.
- form - Catalog of forms.
- repository - Catalog of repositories.
- service - Catalog of services.
- transports - Objects for working with external resources (CRUD HTTP, REST, GraphQL, IndexedDB, WS).
- static - UI resources (fonts, images, audio, video).
- pages - Catalog of pages.
- library - Directory containing classes, interfaces, utilities for the current project.
- vars - CSS and JS variables.
- router.tsx - Contains the implementation of the logic of the router.
- index.tsx - Entry point to run in the browser. Used to design and build the result.
- typings.d.ts - Declaration for non-TS modules.
- vendors.ts - Information to compile dll_bundle.
- lib_exports.ts - Point of export, classes, interfaces, functions, constants, enums, and so on.
- **DLL - dynamic dependencies that are analyzed by webpack via manifest.json**.
- **Library - compiled js file containing export to the outside of the defined API, it can be as UI components, classes, functions, constants, enums, interfaces**.
- **Master-project - a project that connects all dependencies, this particular project is going to be deployed**.
- **Master-project - can be implemented as a monolithic project, a project connecting libraries (ui-library, classes-library, dll-packe, slave-project, и прочие)**.
- **Slave-project - may have its own implementation of UI and business logic. As well as the master-project can connect any library.**

### Monolithic project structure or master-project or slave project

```
monolit-project || master-project || slave-project
├── package.json
└── src - context
    ├── decorators
    ├── components - UI part of the project
    ├── compositions - UI part of the project
    ├── static - UI resources
    ├── vars - UI variables
    ├── pages - Application pages
    ├── adapters - Adapts the business logic interface to the UI interface
    ├── implementation - Implementation of business logic
    │   ├── aggregate
    │   ├── filter
    │   ├── form
    │   ├── repository
    │   ├── service
    │   └── transports
    ├── interfaces - Interfaces of business logic
    │   ├── aggregate
    │   ├── filter
    │   ├── form
    │   ├── repository
    │   ├── service
    │   └── transports
    ├── library
    ├── router.ts - Implementations routing logic
    ├── index.tsx - Entry point, can be changed into configuration
    ├── typings.d.ts
    ├── vendors.ts - Entry point for DLL, can be changed into configuration
    └── lib_exports.ts - Export point for API, can be changed into configuration
```

### DLL package structure

```
dll-package
├── package.json
└── src - context
    └── vendors.ts - Entry point for DLL, can be changed into configuration
```

### Ui library structure

```
ui-library
├── package.json
└── src - context
    ├── decorators
    ├── components - UI part of the project
    ├── compositions - UI part of the project
    ├── static - UI resources
    ├── vars - UI variables
    ├── pages - Application pages
    ├── adapters - Contains stub objects
    ├── router.ts - Implementations routing logic
    ├── index.tsx - Entry point, can be changed into configuration
    ├── typings.d.ts
    ├── vendors.ts - Entry point for DLL, can be changed into configuration
    └── lib_exports.ts - Export point for API, can be changed into configuration
```

### Class Library Structure

```
classes-library
├── package.json
└── src - context
    ├── implementation - Implementation of classes
    ├── interfaces - Interfaces of classes
    ├── library
    ├── index.tsx - Entry point, can be changed into configuration
    ├── typings.d.ts
    ├── vendors.ts - Entry point for DLL, can be changed into configuration
    └── lib_exports.ts - Export point for API, can be changed into configuration
```

### Master-project structure

```
master-project
├── package.json
└── src - context
    ├── decorators
    ├── vars - UI variables
    ├── pages - Application pages
    ├── adapters - Adapts the business logic interface to the UI interface
    ├── implementation - Implementation of business logic
    │   ├── aggregate
    │   ├── filter
    │   ├── form
    │   ├── repository
    │   ├── service
    │   └── transports
    ├── interfaces - Interfaces of business logic
    │   ├── aggregate
    │   ├── filter
    │   ├── form
    │   ├── repository
    │   ├── service
    │   └── transports
    ├── library
    ├── router.ts - Implementations routing logic
    ├── index.tsx - Entry point, can be changed into configuration
    ├── typings.d.ts
    ├── vendors.ts - Entry point for DLL, can be changed into configuration
    └── lib_exports.ts - Export point for API, can be changed into configuration
```

<a name="modules"></a>

## Modules work example

**outSideProjectFromGitSubmodule** - This project is developed separately, for example, it is a project with HTM, CSS and other static files.

**my-app** - This project needs components that are developed in the project `outSideProjectFromGitSubmodule`.

One of the options for the delivery of components from `outSideProjectFromGitSubmodule` to `my-app`, is the connection `outSideProjectFromGitSubmodule` like git submodule in `my-app`.

```
my-app
├── package.json
├── public - isomorphic.publicDirName
│   └── favicon.ico
└── src - context
    ├── outSideProjectFromGitSubmodule (git submodule)
    │   ├── package.json
    │   ├── public
    │   │   └── favicon.ico
    │   └── src
    │       ├── components
    │       │   ├── Component3.jsx
    │       │   └── Component4.jsx
    │       ├── export.jsx
    │       └── index.jsx
    ├── components
    │   ├── Component1.jsx
    │   └── Component2.jsx
    └── index.jsx - entry
```

export.jsx

```ecmascript 6
export {default as Component3} from 'components/Component3'
export {default as Component4} from 'components/Component4'
```

Add `src` as the directory in which webpack buder to look for modules:

```json
{
  "modules": ["src"]
}
```

Now to get the `export.jsx` you need to write the following import in the`Component2.jsx` file:

```ecmascript 6
import { Component3 } from 'outSideProjectFromGitSubmodule/src/export'
```

Or get `Component4` without using `export.jsx`

```ecmascript 6
import Component4 from 'outSideProjectFromGitSubmodule/src/components/Component4'
```

Add another directory `src/outSideProjectFromGitSubmodule/src` from (git submodule) which contains the components we are interested in.

```json
{
  "modules": ["src", "src/outSideProjectFromGitSubmodule/src"]
}
```

Now to get the `export.jsx` you need to write the following import in the `Component2.jsx` file:

```ecmascript 6
import { Component3 } from 'export'
```

Or get `Component4` without using `export.jsx`

```ecmascript 6
import Component4  from 'components/Component4'
```

Or even like this:

```json
{
  "modules": ["src", "src/outSideProjectFromGitSubmodule/src", "src/outSideProjectFromGitSubmodule/src/components"]
}
```

And get `Component4` by name only

```ecmascript 6
import Component4  from 'Component4'
```

<a name="css"></a>

## CSS work example

### Externals styles

All styles that are not inside the **context** directory will be loaded unchanged using:

- isomorphic-style-loader
- css-loader

### Modular styles

The styles inside the **context** will be processed through PostCSS plugins and loaded as modules. List of loaders:

- isomorphic-style-loader
- css-loader
- postcss-loader

### isomorphic-style-loader

Thus styles are imported.

HOC withStyles - is needed so that when componentWillMount styles appear on the page, and when componentWillUnmount
they have been removed from the page.

File `MyComponent.css`

```css
.root {
  width: 100%;
}
```

File `MyComponent.tsx`

```typescript jsx
import React, { Component } from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import style from "./MyComponent.css";

@withStyles(style)
class MyComponent extends Component<any, any> {
  render() {
    return <div className={style.root}>Example</div>;
  }
}

export default MyComponent;
```

The style object contains:

- CSS class names
- Method \_getCss(), which returns the CSS text that is inserted on the page.
- Method \_insertCss() - which adds CSS to the page and returns a method to remove CSS from the page.
- The \_getContent() method - which returns an object, where keys are class names, and values are "modular" class names.

Внутри withStyles используются эти методы для добавления и удаления CSS из head.

### Connecting styles from node_modules

Файл `store/browserHistory`

```typescript jsx
import createHistory from "history/createBrowserHistory";

export const browserHistory = createHistory();
```

Файл `pages/App`

```typescript jsx
import StyleContext from "isomorphic-style-loader/StyleContext";
import normalize from "normalize.css";
import React, { Component } from "react";
import s from "./App.css";

class App extends Component<any, never> {
  public static contextType = StyleContext;

  private removeCSS: () => void;

  constructor(props, context) {
    super(props, context);

    this.removeCSS = this.context.insertCss(normalize, s);
  }

  public componentWillUnmount() {
    this.removeCSS();
  }

  public render() {
    return React.Children.only(this.props.children);
  }
}

export default App;
```

Файл `./router`

```typescript jsx
import React from "react";
import { LoginPage } from "./pages/administration/LoginPage/LoginPage";
import { UserAdminPage } from "./pages/administration/UserAdminPage/UserAdminPage";
import { CommonPage } from "./pages/common/CommonPage";
import { browserHistory } from "./store/browserHistory";

export function router() {
  const pathname: string = browserHistory.location.pathname;

  switch (pathname) {
    case "/login":
      return <LoginPage />;
    case "/admin":
      return <UserAdminPage />;
    case "/common":
      return <CommonPage />;
    default: {
      browserHistory.replace("/event/flightReport", null);
      return null;
    }
  }
}
```

Файл `index.tsx`

```typescript jsx
import { LocaleProvider } from "antd";
import s from "antd/dist/antd.css";
import enUS from "antd/lib/locale-provider/en_US";
import StyleContext from "isomorphic-style-loader/StyleContext";
import App from "pages/App";
import React from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "store/browserHistory";

let container: Element | null;
const insertCss = (...styles: any[]) => {
  const removeCss = styles.map((style_item: any) => style_item._insertCss());

  return () => removeCss.forEach((dispose) => dispose());
};

const render = (Root) => {
  const { router } = require("./router");
  const Page = router();

  if (Page) {
    ReactDOM.render(
      <StyleContext.Provider value={{ insertCss }}>
        <LocaleProvider locale={enUS}>
          <Root>{Page}</Root>
        </LocaleProvider>
      </StyleContext.Provider>,
      container,
    );
  }
};

browserHistory.listen(() => {
  render(App);
});

document.addEventListener("DOMContentLoaded", () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  style.antd._insertCss();

  render(App);
});

declare var module: any;

if (module.hot) {
  module.hot.accept("./router", () => {
    render(App);
  });
}

declare var process: { env: { NODE_ENV: string } };

if (process.env.NODE_ENV === "production") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

export const style: { antd: any } = {
  antd: s,
};
```

### Creating HTML report in the browser

Below I will give an example of how you can use the isomorphic-style-loader to get css text and create an html file.

file `ReportTable.css`

```css
.root :global(.ant-table-body) {
  overflow: auto;
}

.row {
  padding: 0 !important;
  display: block;
  float: left;
  width: 80px;
  height: 100%;
  text-align: center;
  line-height: 54px;
  border-right: 1px solid #e8e8e8;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.row:last-child {
  border-right: 0;
}
```

File `ReportTable.tsx`

```typescript jsx
import React, { PureComponent } from "react";
import s from "./ReportTable.css";

class ReportTable extends PureComponent<any, any> {
  private style: any;
  private removeCSS: () => void;

  constructor(props, context) {
    super(props, context);

    this.style = s;
  }

  componentWillMount() {
    this.removeCSS = this.style._insertCss();
  }

  componentWillUnmount() {
    this.removeCSS();
  }

  render() {
    return (
      <table className={s.root}>
        <tbody>
          <tr>
            <td className={s.row}>DATA_1</td>
            <td className={s.row}>DATA_2</td>
            <td className={s.row}>DATA_3</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export const style: any = s;

export default ReportTable;
```

File `ReportSmart.tsx`

```typescript jsx
import * as root from "index"; // Файл из предидущего примера (index.tsx).
import React, { Component } from "react";
import ReactDOM from "react-dom/server";
import Control from "stubComponents/ReportControl";
import ReportTable, { style } from "./ReportTable";

class ReportSmart extends Component<any, any> {
  reportToHTML(): void {
    const body = ReactDOM.renderToStaticMarkup(<ReportTable />);
    const html = `
      <!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <title>Report</title>
              <style type="text/css">${root.style.antd._getCss()}</style>
              <style type="text/css">${style._getCss()}</style>
          </head>
          <body>${body}</body>
        </html>
      `;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = "report.html";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  render() {
    return [<Control key={1} uploadReport={this.reportToHTML} />, <ReportTable key={2} />];
  }
}

export default ReportSmart;
```

As a result, we corrupt the HTML file `report.html` which contains the HTML resulting from the component render.
ReportTable and the necessary css text for it, from the external package `antd/dist/antd.css` and the modular css of the component itself.

Questions and suggestions can be written in the issue or directly to me: [Dmitriy Borodin](http://borodin.site)

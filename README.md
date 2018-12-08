# Rearguard
- [Что такое rearguard?](#whatIsIt)
- [Технологии](#tech)
- [Настройки](#settings)
- [Установка](#install)
- [CLI](#cli)
- [Структура проекта](#structure)
- [Пример работы modules](#modules)
- [Пример работы c CSS](#css)

<a name="whatIsIt"></a>

### Что такое rearguard?

Rearguard - это интрумент сборки и разработки сайтов, одностраничных приложений,
мобильных и десктопных приложений (на базе проекта Cordova). Инструмент 
поддерживает библиотека ориентированную парадигму разработки. Также 
поддерживается способ разработки известный как монорепозиторий. Монолитный 
способ разработки не исключён и является частным случаем.

<a name="tech"></a>

#### Технологии

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
- React server rendering
- Java
- Swift

Данный список технологий используется для создания сайтов, одностраничных 
приложений, мобильных и настольных приложений основанных на проекте Cordova.

<a name="settings"></a>

### Настройки
#### Версионируемые
Все версионируемые настройки находятся в поле rearguard: {/* поля настроек */}, внутри package.json.

- context: string - директория контекста, указывается относительно текущей рабочей директории.
- entry: string - точка входа в проект, используется для сборки (проекта) и/или разработки (проекта, библиотеки). Точка входа в проект не имеет экспортов API.
- dll_entry: string - точка входа для DLL, в результате будет собран dll_bindle и manifest.json.
- lib_entry: string - точка выхода API библиотеки, в результате будет собран lib_bundle для подключения в браузере и скомпилированы соответсвующие директории в директорию lib для использования d.ts файлов в IDE и js файлов в среде node.js.
- modules: string[] - список директорий внутри context, которые можно считать модулями. Позволяет писать не относительные и не абсолютные пути. Но если вы создаете библиотеку то вам необходимо использовать абсолютные пути.
- output: { path: string; publicPath: string } - указывается директория в которую вываливать результат сборки проекта, а так же публичный путь для доступа к файлам из браузера.
- post_css_plugins_path: string - указывает на файл с module.exports = [ /*подключенные плагины для post_css*/ ], отновительно текущей рабочей директории.
- sync_project_deps: string[] - список названий модулей, которые необходимо подключить к проекту. В частности какие dll_bundle и lib_bundle необходимо подключить в браузер. Так же каждый из указанных модулей ищется в глобальном node_modules и копируется в локальный при изменении модуля по линку. Эта настройка позволяет осуществлять сборку и разработку текущего проекта или библиотеки, а так же разработку зависимого модуля.
- has_dll: boolean - говорит о том, что в текущем проекте есть dll_bundle;
- has_node_lib: boolean - говорит о том, что в текущем проекте компилируется версия для использования в среде node.js;
- has_ui_lib: boolean - говорит о том, что в текущем проекте есть lib_bundle, который будет использоваться в браузерной среде;
- has_project: boolean - говорит о том, что текущий проект можно использовать как самостоятельный. Сделать сборку из entry и залить на сервер.
- publish_in_git: boolean - говорит о том, что проект публикуется только в  git, в npm registry его публиковать не нужно.

#### Не версионируемые
Все не версионируемые настройки находятся в файле rearguard.json.

- analyze: { port: 10000 (значение по умолчанию) } - декларируется порт для средства анализа бандла.
- status: "init"(значение по умолчанию) - статус сборки проекта бывает «init», «in_progress», «done». Прослушивая эту настройку можно понять на какой стадии находится сборка проекта.
- wds: { host: string, port: string, proxy: { [key: string]: any } } - настройки для webpack-dev-server.

#### Мета
Все мета файлы являются автоматически генерируемыми. Внесение изменений в эти файлы только через pull request;

- monorepo.json - содержит { modules: string }, указывает на директорию в которой находится модули.
- .prettierrc - содержит настройки для prettier.io.
- tslint.json - содержит настройки для tsLint.
- tsconfig.json - содержит настройки для typescript.
- .npmrc - содержит настройки для npm.
- pre_publish.sh - содержит набор действий для проверки пакета перед публикацией.
- typings.d.ts - содержит декларацию типов для модулей с расширениями отличающиеся от ts;
- .dockerignore - содержит информацию о том, какие директории и файлы убрать из контекста докера.
- .editorconfig - определяет настройки табуляции для IDE.
- .gitignore - указывает какие файлы и директории не версионируются.
- postcss.config.js - файл в который подключаются плагины для post_css.

<a name="install"></a>

### Установка

Пакет можно установить как локально так и глобально. Это зависит от ваших предпочтений. Установка глобально экономит
место на диске, но у вас будет одна версия на все проекты, что в общем не плохо. Но и у локальной установки есть
плюсы: она позволят вам использовать конкретную версию для проекта.

Глобально, для использования сразу в нескольких проектах.

```sh
npm install -g rearguard
```

Локально, в проект и сохранением точной версии.

```sh
npm install -D rearguard
```

Лично я ставлю глобально `:-)`

<a name="cli"></a>

### CLI
- rearguard init [ --project | --dll | --ui_lib | --node_lib | --force ]
- rearguard wds [ --release | -r | --debug ]
- rearguard build [ --project | --dll | --ui_lib | --node_lib | --release | -r | --both | --debug ]
- rearguard build_node_server
- rearguard watch_deps_for_node_dev
- rearguard monorepo [ --init | --install | --build | --link | --bootstrap | --sync | --test | --publish | --patch | --minor | --major ]

<a name="structure"></a>

### Структура проекта

```
my-app
├── package.json
└── src - context
    ├── decorators - Декораторы и HOC компоненты.
    ├── interfaces - TS интерфейсы.
    ├── pages - Каталог страниц.
    ├── services - Сервисы для работы с внешними ресурсами (CRUD HTTP, REST, GraphQL, IndexedDB, WS)
    ├── smartComponents - Компонеты которы содержат логику работы с данными и не содержат верстки и CSS.
    ├── static - статические файлы (fonts, images)
    ├── stores - Каталог хранилищ приложения, тут описывается бизнес логика работы приложения ("мозги приложения").
    ├── stubComponents - верстка (UI пакеты такие как [Ant](https://ant.design/)).
    ├── utils - Униферсальные классы и функции.
    ├── vars - CSS переменные и JS переменные.
    ├── vendors.ts - Описывает внешние зависимости пакета, могут быть как из node_modules так и из других мест.
    ├── typings.d.ts - Генерируется автоматически, декларируются css модули и модули для статических файлов.
    └── index.tsx - Точка входа в приложение.
```

<a name="modules"></a>

### Пример работы modules

**outSideProjectFromGitSubmodule** - этот проект разрабатывается отдельно, например, это проект с версткой.

**my-app** - этот проект нуждается в компонентах, которые разрабатываются в проекте `outSideProjectFromGitSubmodule`.

Одним из вариантов доставки компонентов из `outSideProjectFromGitSubmodule` в `my-app`, является подключение `outSideProjectFromGitSubmodule` как git submodule в `my-app`.

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

Добавим `src` как директорию в которой webpack будер искать модули:

```json
{
  "modules": ["src"]
}
```

Теперь для получения `export.jsx` необходимо в файле `Component2.jsx` написать следующий импорт:

```ecmascript 6
import { Component3 } from 'outSideProjectFromGitSubmodule/src/export'
```

Или получить `Component4` без использования `export.jsx`

```ecmascript 6
import Component4 from 'outSideProjectFromGitSubmodule/src/components/Component4'
```

Добавим ещё одну директорию `src/outSideProjectFromGitSubmodule/src` из (git submodule) в котором имеются интересующие нас компоненты.

```json
{
  "modules": ["src", "src/outSideProjectFromGitSubmodule/src"]
}
```

Теперь для получения `export.jsx` необходимо в файле `Component2.jsx` написать следующий импорт:

```ecmascript 6
import { Component3 } from 'export'
```

Или получить `Component4` без использования `export.jsx`

```ecmascript 6
import Component4  from 'components/Component4'
```

Или даже так:

```json
{
  "modules": [
    "src",
    "src/outSideProjectFromGitSubmodule/src",
    "src/outSideProjectFromGitSubmodule/src/components"
  ]
}
```

И получить `Component4` по одному только имени

```ecmascript 6
import Component4  from 'Component4'
```

<a name="css"></a>

### Работа с CSS

#### Внешние стили

Все стили котрые не находятся внутри директории **context** будут загружены без изменений используя:

- isomorphic-style-loader
- css-loader

#### Модульные стили

Стили находящиеся внутри **context** будут обработаны через плагины PostCSS и загруженны как модули. Список загрузчиков:

- isomorphic-style-loader
- css-loader
- postcss-loader

#### isomorphic-style-loader

Таким образом импортируются стили.

HOC withStyles - необходим для того чтобы при componentWillMount стили оказались на странице, а при componentWillUnmount
они были удалены со страницы.

Файл `MyComponent.css`

```css
.root {
  width: 100%;
}
```

Файл `MyComponent.tsx`

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

Объект style содержит:

- Имена CSS классов
- Метод \_getCss(), который возвращает текст CSS который вставлен на страницу.
- Метод \_insertCss() - который добавляет CSS на страницу и возвращает метод удаления CSS со страницы.
- Метод \_getContent() - который возвращает объект, где ключи это имена классов, а значения это "модульные" имена классов.

Внутри withStyles используются эти методы для добавления и удаления CSS из head.

#### Подключение стилей из node_modules

Файл `index.tsx`

```typescript jsx
import s from "antd/dist/antd.css"; // Эти стили находятся вне context и они будут добавлены как есть.
import App from "pages/App";
import React from "react";
import ReactDOM from "react-dom";

let container;

const render = (Component) => {
  ReactDOM.render(<Component />, container);
};

document.addEventListener("DOMContentLoaded", () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  style.antd._insertCss(); // Тут мы добавляем CSS на страницу.

  render(App);
});

// Возможно вам понадобится текст CSS от подключенных внешних стилей и я рекомендую экспортировать этот объект стилей.
export const style: { antd: any } = {
  antd: s,
};
```

#### Создание HTML отчета в браузере

Ниже я приведу пример того как можно использовать isomorphic-style-loader для получения css текста и создания html файла.

файл `ReportTable.css`

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

Файл `ReportTable.tsx`

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

Файл `ReportSmart.tsx`

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
    return [
      <Control key={1} uploadReport={this.reportToHTML} />,
      <ReportTable key={2} />,
    ];
  }
}

export default ReportSmart;
```

И в итоге мы порлучаем HTML файл `report.html` который содержит HTML полученый в результате рендера компонента
ReportTable и необходимый для него css текст, из внешнего пакета "antd/dist/antd.css" и модульного css самого компонента.

Вопросы и предложения можно написать в issue или непосредственно мне: [Dmitriy Borodin](http://borodin.site)

#### Режими работы

- DLL -
  все зависимости собранные в единый файл, для подключения непосредственно в браузер, зависимоти указываются в файле dll_entry;
  Не запускается в режиме разработки;
  Не имеет экспорт API;
  Не может зависеть от dll_bundle и lib_bundle;
  Не может быть собран для развертывания на сервере;

- Library -
  самостоятельная реализация, как часть Project, так и как повторноиспользуемый код в других Library;
  Запускается в режиме разработки;
  Имеет экспорт API;
  Может зависеть от dll_bundle и lib_bundle;
  Не может быть собран для развертывания на сервере;

- Project -
  результирующий проект;
  Запускается в режиме разработки;
  Не имеет экспорт API;
  Может зависеть от dll_bundle и lib_bundle;
  Может быть собран для развертывания на сервере, создается index.html и в него заносятся необходимые теги;
  Так же копируются все необходимые файлы;
